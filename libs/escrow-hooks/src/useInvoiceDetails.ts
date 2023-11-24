import { getInvoice } from '@raidguild/escrow-gql';
import { useQuery } from '@tanstack/react-query';

const useInvoiceDetails = ({
  invoiceAddress,
  chainId,
}: {
  invoiceAddress: string;
  chainId: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['invoiceDetails', invoiceAddress && chainId],
    queryFn: () => getInvoice(chainId, invoiceAddress),
    enabled: !!invoiceAddress && !!chainId,
  });

  return { data, isLoading, error };
};

export default useInvoiceDetails;
