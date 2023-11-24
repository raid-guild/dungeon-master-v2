import { Invoice, uploadDisputeDetails } from '@raidguild/escrow-utils';
import { Hex } from 'viem';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

const useLock = ({
  invoice,
}: {
  invoice: Invoice;
}): {
  writeAsync: (() => Promise<any>) | undefined;
  isLoading: boolean | undefined;
  prepareError: Error | null;
  writeError: Error | null;
} => {
  console.log('useLock', invoice);

  const detailsHash = '';

  // const detailsHash = await uploadDisputeDetails({
  //   reason: disputeReason,
  //   invoice: address,
  //   amount: balance.toString(),
  // });

  // const lockFunds = useCallback(async () => {
  //   if (provider && !locking && balance.gt(0) && disputeReason) {
  //     try {
  //       setLocking(true);
  //       const detailsHash = await uploadDisputeDetails({
  //         reason: disputeReason,
  //         invoice: address,
  //         amount: balance.toString(),
  //       });
  //       const tx = await lock(provider, address, detailsHash);
  //       setTransaction(tx);
  //       await tx.wait();
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 20000);
  //     } catch (lockError) {
  //       setLocking(false);
  //       console.error(lockError);
  //     }
  //   }
  // }, [provider, locking, balance, disputeReason, address]);

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    address: invoice.address as Hex,
    functionName: 'lock',
    abi: ['lock(address,bytes32)'],
    args: [invoice.address, detailsHash],
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

export default useLock;
