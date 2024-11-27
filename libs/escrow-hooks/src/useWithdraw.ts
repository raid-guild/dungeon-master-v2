import { Invoice } from '@raidguild/escrow-utils';
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

  return {
    writeAsync: () => writeContractAsync(data.request),
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useWithdraw;
