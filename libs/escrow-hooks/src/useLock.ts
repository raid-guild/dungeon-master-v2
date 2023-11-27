import { Invoice, uploadDisputeDetails } from '@raidguild/escrow-utils';
import { Hex } from 'viem';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useLock = ({
  invoice,
  disputeReason,
  amount,
}: {
  invoice: Invoice;
  disputeReason: string;
  amount: string;
}) => {
  console.log('useLock', invoice);

  const detailsHash =
    '0x0000000000000000000000000000000000000000000000000000000000000000';

  // const detailsHash = await uploadDisputeDetails({
  //   reason: disputeReason,
  //   invoice: address,
  //   amount: balance.toString(),
  // });

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    address: invoice.address as Hex,
    functionName: 'lock',
    abi: INVOICE_ABI,
    args: [detailsHash],
    enabled: !!invoice?.address && !!disputeReason,
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: () => {
      console.log('success');

      // handle success
      // close modal
      // update invoice with status
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

export default useLock;
