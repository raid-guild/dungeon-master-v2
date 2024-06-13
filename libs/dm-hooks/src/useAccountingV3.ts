/* eslint-disable no-await-in-loop */
import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { getAddress } from 'viem';

const graphUrl = (chainId: number = 4) =>
  `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[chainId].SUBGRAPH}`;

export const SUPPORTED_NETWORKS = _.map(_.keys(NETWORK_CONFIG), _.toNumber);

export const client = (chainId: number) => new GraphQLClient(graphUrl(chainId));
export const v3client = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/hausdao/daohaus-v3-gnosis'
);

const API_URL = 'https://safe-transaction-gnosis-chain.safe.global/api/v1';

const transformTokenBalances = (tokenBalanceRes, safeAddress: string) => {
  const fiatTotal = tokenBalanceRes.reduce(
    (sum: number, balance) => sum + Number(balance.balance),
    0
  );
  return { safeAddress, tokenBalances: tokenBalanceRes, fiatTotal };
};

const listTokenBalances = async ({ safeAddress }) => {
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

const getSafeTransactionProposals = async ({ safeAddress }) => {
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

      allTxData = [...allTxData, ...txData.results];

      if (txData.next) {
        offset += limit;
      } else {
        hasNext = false;
      }
    }

    return { txData: allTxData };
  } catch (err) {
    return {
      error: `Error fetching safe transactions. Please try again. ${err}`,
    };
  }
};

const useAccountingV3 = () => {
  const checksum = getAddress('0x181ebdb03cb4b54f4020622f1b0eacd67a8c63ac');

  const { data: tokenBalances, error: tokenBalancesError } = useQuery(
    ['tokenBalances', checksum],
    () => listTokenBalances({ safeAddress: checksum })
  );

  const { data: txResponse, error: txResponseError } = useQuery(
    ['transactions', checksum],
    () => getSafeTransactionProposals({ safeAddress: checksum })
  );

  console.log('txResponse?.txData', txResponse?.txData);
  const proposalQueries =
    txResponse?.txData?.map((tx) => {
      const txHash = tx.transactionHash || tx.txHash;
      return {
        queryKey: ['proposal', txHash],
        queryFn: async () => {
          const proposal: { proposals: any[] } = await v3client.request(`
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
          return proposal?.proposals[0];
        },
      };
    }) || [];

  const proposalsInfo = useQueries({ queries: proposalQueries });

  console.log(
    'proposalsInfo',
    proposalsInfo.map((query) => query.data)
  );

  const memberQueries =
    proposalsInfo
      ?.filter((proposalQuery) => proposalQuery.data)
      ?.map((proposalQuery) => ({
        queryKey: ['member', proposalQuery.data?.proposedBy],
        queryFn: async () => {
          const m: { members: any[] } = await v3client.request(`
          {
            members(where: { memberAddress: "${proposalQuery.data?.proposedBy}" }) {
              id
              createdAt
              memberAddress
              shares
              loot
              delegatingTo
              delegateShares
            }
          }
        `);
          return m.members[0];
        },
      })) || [];

  const members = useQueries({ queries: memberQueries });

  const error = tokenBalancesError || txResponseError;

  const proposalsInfoData = proposalsInfo
    ?.filter((query) => query.data !== undefined)
    ?.map((query) => query.data);

  const transformProposals = (proposalsInfoData || []).reduce(
    (acc, proposal) => {
      const { processTxHash, ...rest } = proposal;
      acc[processTxHash] = rest;
      return acc;
    },
    {}
  );

  const data = {
    tokens: tokenBalances?.data,
    transactions: txResponse?.txData,
    proposalsInfo: transformProposals,
    members: members?.map((query) => query.data),
  };

  return { data, error };
};

export default useAccountingV3;
