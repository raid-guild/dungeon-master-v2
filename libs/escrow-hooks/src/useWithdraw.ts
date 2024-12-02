import { Invoice } from '@raidguild/escrow-utils';
import { useCallback } from 'react';
import { Hex } from 'viem';
import { useSimulateContract, useWriteContract } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useWithdraw = ({ invoice }: { invoice: Invoice }) => {
  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    address: invoice.address,
    functionName: 'withdraw',
    abi: INVOICE_ABI,
    args: [],
    enabled: !!invoice?.address,
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log('success');

        // handle success
        // close modal
        // update invoice with status
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.log('error', error);
      },
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      /* eslint-disable no-console */
      console.error('useWithdraw error', error);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useWithdraw;
