/* eslint-disable no-await-in-loop */
import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { useEffect, useState } from 'react';
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
  console.log('tokenBalanceRes', tokenBalanceRes);
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const checksum = getAddress('0x181ebdb03cb4b54f4020622f1b0eacd67a8c63ac');
      console.log('checksum', checksum);
      const txResponse = await getSafeTransactionProposals({
        safeAddress: checksum,
      });
      console.log('txResponse', txResponse);
      const tokenBalances = await listTokenBalances({ safeAddress: checksum });
      const proposals = [];
      console.log('txResponse?.txData?.results', txResponse?.txData);
      txResponse?.txData?.forEach(async (tx) => {
        try {
          const proposal: { proposals: any[] } = await v3client.request(`
          {
            proposals(where: { processTxHash: "${tx.transactionHash}"}) {
              id
              createdAt
              createdBy
              proposedBy
              processTxHash
              proposalType
              description
            }
          }
        `);
          const m: { members: any[] } = await v3client.request(`
          members(where: { memberAddress: ${proposal?.proposals[0].proposedBy} }) {
            id
            createdAt
            memberAddress
            shares
            loot
            delegatingTo
            delegateShares
          }
          `);
          console.log('m', m);
          setMembers(m.members[0]);
          proposals.push({ proposal: proposal?.proposals[0] });
        } catch {
          console.log('error');
        }
      });
      if (tokenBalances.error) {
        setError(tokenBalances.error);
      } else {
        console.log(tokenBalances.data);
        setData({
          tokens: tokenBalances.data,
          transactions: txResponse.txData,
          proposalsInfo: proposals,
          members,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useAccountingV3;
