import { Invoice } from '@raidguild/escrow-utils';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

const useRelease = ({
  invoice,
}: {
  invoice: Invoice;
}): {
  writeAsync: (() => Promise<any>) | undefined;
  prepareError: Error | null;
  writeError: Error | null;
} => {
  const chainId = useChainId();
  // const releaseFunds = async () => {
  //   if (
  //     !loading &&
  //     provider &&
  //     balance &&
  //     balance.gte(getReleaseAmount(currentMilestone, amounts, balance))
  //   ) {
  //     try {
  //       setLoading(true);
  //       const tx = await release(provider, address);
  //       setTransaction(tx);
  //       await tx.wait();
  //       await pollSubgraph();
  //     } catch (releaseError) {
  //       console.error(releaseError);
  //       setLoading(false);
  //       toast.error({
  //         title: 'Oops there was an error',
  //         iconName: 'alert',
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   }
  // };

  const { config, error: prepareError } = usePrepareContractWrite({
    chainId,
    address: invoice?.address,
    abi: ['release()'],
    functionName: 'release',
    args: [], // optional args
    enabled: !!invoice?.address,
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: async (tx) => {
      console.log('deposit tx', tx);
    },
    onError: async (error) => {
      console.log('deposit error', error);
    },
  });

  return { writeAsync, prepareError, writeError };
};

export default useRelease;
