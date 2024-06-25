/* eslint-disable no-await-in-loop */
import { Proposal, RageQuit } from '@raidguild/dm-types';
import { GNOSIS_SAFE_ADDRESS } from '@raidguild/dm-utils';
import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { getAddress } from 'viem';

const graphUrl = (chainId: number = 4) =>
  `https://api.thegraph.com/subgraphs/name/${_.get(NETWORK_CONFIG, [
    chainId,
    'SUBGRAPH',
  ])}`;

export const SUPPORTED_NETWORKS = _.map(_.keys(NETWORK_CONFIG), _.toNumber);

export const client = (chainId: number) => new GraphQLClient(graphUrl(chainId));

const API_URL = 'https://safe-transaction-gnosis-chain.safe.global/api/v1';

const transformTokenBalances = (tokenBalanceRes, safeAddress: string) => {
  const fiatTotal = _.reduce(
    tokenBalanceRes,
    (sum: number, balance) => sum + Number(balance.balance),
    0
  );
  return { safeAddress, tokenBalances: tokenBalanceRes, fiatTotal };
};

const listTokenBalances = async ({ safeAddress }: { safeAddress: string }) => {
  try {
    const res = await fetch(`${API_URL}/safes/${safeAddress}/balances/`);
    const data = await res.json();
    const filteredTokenBalanceRes = _.filter(data, 'tokenAddress');

    return {
      data: transformTokenBalances(filteredTokenBalanceRes, safeAddress),
    };
  } catch (err) {
    return { error: `Error fetching token balances. Please try again. ${err}` };
  }
};

const getSafeTransactionProposals = async ({
  safeAddress,
}: {
  safeAddress: string;
}) => {
  try {
    const limit = 100;
    let offset = 0;
    let allTxData = [];

    let hasNext = true;
    while (hasNext) {
      const res = await fetch(
        `${API_URL}/safes/${safeAddress}/all-transactions/?limit=${limit}&offset=${offset}`
      );
      const txData = await res.json();
      allTxData = _.concat(allTxData, txData.results);

      hasNext = !!txData.next;
      if (hasNext) offset += limit;
    }

    return { txData: allTxData };
  } catch (err) {
    return {
      error: `Error fetching safe transactions. Please try again. ${err}`,
    };
  }
};

const getRageQuits = async (v3client: GraphQLClient): Promise<RageQuit[]> => {
  try {
    const rageQuits: { rageQuits: RageQuit[] } = await v3client.request(`
      {
        rageQuits(where: { dao: "${GNOSIS_SAFE_ADDRESS}" }) { 
          shares
          txHash
        }
      }
    `);

    return rageQuits.rageQuits;
  } catch (error) {
    return [];
  }
};

const useAccountingV3 = () => {
  const checksum = getAddress(GNOSIS_SAFE_ADDRESS);

  const v3client = new GraphQLClient(
    `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_THE_GRAPH_API_KEY}/subgraphs/id/6x9FK3iuhVFaH9sZ39m8bKB5eckax8sjxooBPNKWWK8r`
  );

  const { data: tokenBalances, error: tokenBalancesError } = useQuery(
    ['tokenBalances', checksum],
    () => listTokenBalances({ safeAddress: checksum })
  );

  const { data: txResponse, error: txResponseError } = useQuery(
    ['transactions', checksum],
    () => getSafeTransactionProposals({ safeAddress: checksum })
  );

  const { data: rageQuitsData, error: rageQuitsError } = useQuery(
    ['rageQuits'],
    () => getRageQuits(v3client)
  );

  const proposalQueries =
    _.map(txResponse?.txData, (tx) => {
      const txHash = tx.transactionHash || tx.txHash;
      return {
        queryKey: ['proposal', txHash],
        queryFn: async (): Promise<Proposal | null> => {
          try {
            const proposal: { proposals: Proposal[] } = await v3client.request(`
            {
              proposals(where: { processTxHash: "${txHash}"}) {
                id
                createdAt
                createdBy
                proposedBy
                processTxHash
                proposalType
                description
                title
                txHash
              }
            }
          `);
            if (!_.size(proposal.proposals)) {
              return null;
            }
            return _.first(proposal.proposals) || null;
          } catch (error) {
            return null;
          }
        },
        onError: (error: Error) => {
          console.error(
            `Error in query proposal with txHash: ${txHash}`,
            error
          );
        },
      };
    }) || [];

  const proposalsInfo = useQueries({ queries: proposalQueries });

  const error = tokenBalancesError || txResponseError || rageQuitsError;
  const transformProposals = proposalsInfo
    .filter((query) => query.data)
    .map((query) => query.data as Proposal)
    .reduce((acc, proposal) => {
      const { processTxHash, ...rest } = proposal;
      acc[processTxHash] = rest;
      return acc;
    }, {} as Record<string, Omit<Proposal, 'processTxHash'>>);

  const data = {
    tokens: tokenBalances?.data,
    transactions: txResponse?.txData,
    rageQuits: rageQuitsData || [],
    proposalsInfo: transformProposals,
  };

  return { data, error };
};

export default useAccountingV3;
