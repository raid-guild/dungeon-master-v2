import { da } from 'date-fns/locale';
import { useState, useEffect } from 'react';

import { getAddress } from 'viem';


export const transformTokenBalances = (
  tokenBalanceRes: any,
  safeAddress: string
): any => {
  const fiatTotal = tokenBalanceRes.reduce(
    (sum: number, balance: any): number => {
      sum += Number(balance.fiatBalance);
      return sum;
    },
    0
  );

  return { safeAddress, tokenBalances: tokenBalanceRes, fiatTotal };
};

export const listTokenBalances = async ({
  safeAddress,
}: {
  safeAddress: string;
}): Promise<any> => {
  const url = 'https://safe-transaction-gnosis-chain.safe.global/api/v1'

  if (!url) {
    return {
      error: 'Error fetching token balances. Please try again.'
    };
  }

  try {
    const res = await fetch(
      `${url}/safes/${safeAddress}/balances/usd/`
    );
    const data = await res.json();
    console.log(data)
    //
    return { data: transformTokenBalances(data, safeAddress) };
  } catch (err) {
    return {
      error: 'Error fetching token balances. Please try again.'
    };
  }
};

// this is a dummy hook
const useAccountingV3 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const checksum = getAddress('0x181ebdb03cb4b54f4020622f1b0eacd67a8c63ac');
      console.log(checksum)
      const { data, error } = await listTokenBalances({
        safeAddress: checksum,
      });

      if (error) {
        setError(error);
        console.log('error', error)
      } else {
        setData(data);
        console.log('data', data);
      }

      setLoading(false);
    };

    fetchData();
    console.log('fetching data', data);
  }, [])

  return { data: null, loading: false, error: null };
};

export default useAccountingV3;
