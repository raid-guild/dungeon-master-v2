import { useEffect, useState } from 'react';
import { getAddress } from 'viem';

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
      if (response.error) {
        setError(response.error);
      } else {
        console.log(response.data);
        setData({tokens: response.data, transactions: txResponse.txData});
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useAccountingV3;
