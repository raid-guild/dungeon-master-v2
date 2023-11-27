import { Invoice, PAYMENT_TYPES } from '@raidguild/escrow-utils';
import { parseUnits } from 'viem';
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
  hasAmount,
  paymentType,
}: {
  invoice: Invoice;
  amount: string;
  hasAmount: boolean;
  paymentType: string;
}) => {
  const chainId = useChainId();

  const token = invoice?.token;
  const depositAmount = amount && parseUnits(amount, 18);

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
    onSuccess: async (tx: any) => {
      console.log('deposit tx', tx);

      // TODO catch success
      // wait for tx
      // update invoice
      // close modal
    },
    onError: async (error: any) => {
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
    writeAsync: handleDeposit,
    isLoading: prepareLoading || writeLoading || sendLoading,
    writeError,
    prepareError,
  };
};

export default useDeposit;
