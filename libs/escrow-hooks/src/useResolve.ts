import { Invoice, uploadDisputeDetails } from '@raidguild/escrow-utils';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useResolve = ({
  invoice,
  clientAward,
  providerAward,
}: {
  invoice: Invoice;
  clientAward: number;
  providerAward: number;
}): {
  writeAsync: (() => Promise<any>) | undefined;
  isLoading: boolean | undefined;
  prepareError: Error | null;
  writeError: Error | null;
} => {
  const detailsHash = '';

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    address: invoice.address,
    functionName: 'resolve',
    abi: INVOICE_ABI,
    args: [clientAward, providerAward, detailsHash],
    enabled: !!invoice.address, // isLocked, balance > 0, balance.eq(clientAward.add(providerAward).add(resolverAward)), comments
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: () => {
      console.log('success');
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useResolve;
