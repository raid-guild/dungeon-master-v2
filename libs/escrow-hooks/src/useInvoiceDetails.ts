import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchInvoiceDetails = async (invoiceId: string) => {
  const response = await fetch(`${API_URL}/invoice/${invoiceId}`);
  return response.json();
};

const useInvoiceDetails = (invoiceId: string) => {
  console.log('useInvoiceDetails', invoiceId);

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoiceDetails', invoiceId],
    queryFn: () => fetchInvoiceDetails(invoiceId),
    enabled: !!invoiceId,
  });

  return { data, isLoading, error };
};

export default useInvoiceDetails;
