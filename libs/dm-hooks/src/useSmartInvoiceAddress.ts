import _ from 'lodash';
import { useContractRead } from 'wagmi';
import { utils } from 'ethers';

const useSmartInvoiceAddress = ({
  invoiceAddress,
}: {
  invoiceAddress: string;
}) => {
  const abi = new utils.Interface([
    'function invoice() public view returns(address)',
  ]);

  const { data, isError, isLoading } = useContractRead({
    address: invoiceAddress as `0x{string}`,
    abi: abi as any,
    functionName: 'invoice',
    enabled: !!invoiceAddress,
  });

  return { data, isError, isLoading };
};

export default useSmartInvoiceAddress;
