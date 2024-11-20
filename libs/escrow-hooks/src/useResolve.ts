import { Invoice } from '@raidguild/escrow-utils';
import { useBalance, useSimulateContract, useWriteContract } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

// TODO fix pin

const useResolve = ({
  invoice,
  awards: {
    client: clientAward,
    provider: providerAward,
    resolver: resolverAward,
  },
  comments,
}: {
  invoice: Invoice;
  awards: {
    client: bigint;
    provider: bigint;
    resolver: bigint;
  };
  comments: string;
}) => {
  const detailsHash =
    '0x0000000000000000000000000000000000000000000000000000000000000000';

  const { data: balance } = useBalance({
    address: invoice.address,
    token: invoice.token,
  });

  const fullBalance =
    balance.value === clientAward + providerAward + resolverAward;

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    address: invoice.address,
    functionName: 'resolve',
    abi: INVOICE_ABI,
    args: [clientAward, providerAward, detailsHash],
    enabled:
      !!invoice.address &&
      fullBalance &&
      // invoice?.isLocked &&
      balance.value > BigInt(0) &&
      !!comments,
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        // TODO handle success
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

export default useResolve;
