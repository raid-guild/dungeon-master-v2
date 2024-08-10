import { Invoice, PAYMENT_TYPES } from '@raidguild/escrow-utils';
import { ContractFunctionResult, parseUnits } from 'viem';
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
  decimals,
  hasAmount,
  paymentType,
  onSuccess,
}: {
  invoice: Invoice;
  amount: string;
  decimals: number;
  hasAmount: boolean;
  paymentType: string;
  onSuccess?: (tx: ContractFunctionResult) => void;
}) => {
  const chainId = useChainId();

  const token = invoice?.token;
  const depositAmount = amount && parseUnits(amount, decimals);

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    chainId,
    address: token,
    abi: TOKEN_ABI,
    functionName: 'transfer',
    args: [invoice?.address, depositAmount],
    enabled: hasAmount && paymentType === PAYMENT_TYPES.TOKEN,
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: async (tx) => {
      console.log('deposit tx', tx);

      // TODO catch success
      onSuccess?.(tx);

      // wait for tx
      // update invoice
      // close modal
    },
    onError: async (error) => {
      // eslint-disable-next-line no-console
      console.log('deposit error', error);
    },
  });

  const { isLoading: sendLoading, sendTransactionAsync } = useSendTransaction({
    to: invoice?.address,
    value: depositAmount,
    enabled: !!amount && paymentType === PAYMENT_TYPES.NATIVE,
  });

  const handleDeposit = async () => {
    if (paymentType === PAYMENT_TYPES.NATIVE) {
      const result = await sendTransactionAsync();
      return result;
    }

    const result = await writeAsync?.();
    return result;
  };

  return {
    writeAsync,
    handleDeposit,
    isReady: paymentType === PAYMENT_TYPES.NATIVE ? true : !!writeAsync,
    isLoading: prepareLoading || writeLoading || sendLoading,
    writeError,
    prepareError,
  };
};

export default useDeposit;
