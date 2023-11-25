import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useSendTransaction,
} from 'wagmi';

import TOKEN_ABI from './contracts/Token.json';

const useDeposit = ({
  invoice,
  amount,
  balance,
  hasAmount,
  paymentType,
}: {
  invoice: any;
  amount: bigint;
  balance: bigint;
  hasAmount: boolean;
  paymentType: number;
}) => {
  console.log('useDeposit', invoice?.address);
  const chainId = useChainId();
  const token = invoice?.token;

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    chainId,
    address: token,
    abi: TOKEN_ABI,
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
