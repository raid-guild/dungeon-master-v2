import _ from 'lodash';
import { useContractRead } from 'wagmi';
import { utils } from 'ethers';

// export const getSmartInvoiceAddress = async (address, ethersProvider) => {
//   const abi = new utils.Interface([
//     'function invoice() public view returns(address)',
//   ]);
//   const contract = new Contract(address, abi, ethersProvider);
//   const smartInvoice = await contract.invoice();
//   return smartInvoice;
// };

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
