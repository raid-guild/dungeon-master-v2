import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useSendTransaction,
} from 'wagmi';

const useDeposit = ({
  invoice,
  amount,
  balance,
}: {
  invoice: any;
  amount: bigint;
  balance: bigint;
}) => {
  console.log('useDeposit', invoice?.address);
  const chainId = useChainId();
  const token = invoice?.token;

  const paymentType = 1; // 1 = native token, 2 = token

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    chainId,
    address: token,
    abi: ['transfer(address,uint256)'],
    functionName: 'transfer',
    args: [invoice?.address, amount],
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: async (tx: any) => {
      console.log('deposit tx', tx);
    },
    onError: async (error: any) => {
      console.log('deposit error', error);
    },
  });

  const {
    data,
    isLoading: sendLoading,
    sendTransactionAsync,
  } = useSendTransaction({
    to: invoice?.address,
    value: BigInt(amount),
  });

  const handleDeposit = async () => {
    console.log('depositing', amount);
    // if (paymentType === 0) {
    //   await sendTransactionAsync();
    //   return;
    // }

    await writeAsync?.();
  };

  return {
    writeAsync: handleDeposit,
    isLoading: prepareLoading || writeLoading,
    writeError,
    prepareError,
  };
};

export default useDeposit;
