import { useEffect, useState } from 'react';
import { getAddress } from 'viem';
import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

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
    (sum: number, balance) => sum + Number(balance.fiatBalance),
    0
  );
  return { safeAddress, tokenBalances: tokenBalanceRes, fiatTotal };
};

const listTokenBalances = async ({ safeAddress }) => {
  try {
    const res = await fetch(`${API_URL}/safes/${safeAddress}/balances/`);
    const data = await res.json();
    return { data: transformTokenBalances(data, safeAddress) };
  } catch (err) {
    return { error: `Error fetching token balances. Please try again. ${err}` };
  }
};

const getSafeTransactionProposals = async ({ safeAddress }) => {
  try {
    const res = await fetch(`${API_URL}/safes/${safeAddress}/all-transactions/`);
    const txData = await res.json();
    console.log(txData, 'txData')
    return { txData };
  } catch (err) {
    return { error: `Error fetching safe transactions. Please try again. ${err}` };
  }

}

const useAccountingV3 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(data, 'data')
  useEffect(() => {
    const fetchData = async () => {
      const checksum = getAddress('0x181ebdb03cb4b54f4020622f1b0eacd67a8c63ac');
      const txResponse = await getSafeTransactionProposals({ safeAddress: checksum });
      const response = await listTokenBalances({ safeAddress: checksum });
      let proposals = [] 
      txResponse?.txData?.results?.forEach(async (tx) => {
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
        `)
          // const members: { members: any[] } = await v3client.request(`
          // members(where: { memberAddress: ${proposal?.proposals[0].proposedBy} }) {
          //   id
          //   createdAt
          //   memberAddress
          //   shares
          //   loot
          //   delegatingTo
          //   delegateShares
          // }
          // `)
          // console.log(members, 'members')
        proposals.push({ proposal: proposal?.proposals[0]})
        } catch {
          console.log('error')
        }
      })
      if (response.error) {
        setError(response.error);
      } else {
        console.log(response.data);
        setData({tokens: response.data, transactions: txResponse.txData, proposalsInfo: proposals});
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useAccountingV3;
