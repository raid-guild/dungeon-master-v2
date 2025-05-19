import { getInvoice } from '@raidguild/escrow-gql';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Hex } from 'viem';
import { useReadContract } from 'wagmi';

import WRAPPED_INVOICE_ABI from './contracts/WrappedInvoice.json';

const useInvoiceDetails = ({
  invoiceAddress: wrappedInvoiceAddress,
  chainId,
}: {
  invoiceAddress: Hex;
  chainId: number;
}) => {
  const {
    data: invoiceAddress,
    isLoading: invoiceAddressLoading,
    error: invoiceAddressError,
  } = useReadContract({
    address: wrappedInvoiceAddress,
    abi: WRAPPED_INVOICE_ABI,
    functionName: 'invoice',
    chainId,
  });

  const address = useMemo(() => {
    if (invoiceAddressError?.name === 'ContractFunctionExecutionError') {
      return wrappedInvoiceAddress;
    }
    return invoiceAddress;
  }, [invoiceAddressError, wrappedInvoiceAddress]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoiceDetails', address || wrappedInvoiceAddress, chainId],
    queryFn: () =>
      getInvoice(chainId, (address as Hex) || wrappedInvoiceAddress),
    enabled: !!address && !!chainId && !invoiceAddressLoading,
    staleTime: 1000 * 60 * 15,
  });

  return { data, isLoading, error };
};

export default useInvoiceDetails;
