import { Invoice, PAYMENT_TYPES } from '@raidguild/escrow-utils';
import { useCallback } from 'react';
import { Hex, parseUnits, WriteContractReturnType } from 'viem';
import {
  useChainId,
  useSendTransaction,
  useSimulateContract,
  useWriteContract,
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
  onSuccess?: (tx: WriteContractReturnType) => void;
}) => {
  const chainId = useChainId();

  const token = invoice?.token;
  const depositAmount = amount && parseUnits(amount, decimals);

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    chainId,
    address: token,
    abi: TOKEN_ABI,
    functionName: 'transfer',
    args: [invoice?.address, depositAmount],
    enabled: hasAmount && paymentType === PAYMENT_TYPES.TOKEN,
  });

  const {
    writeContractAsync,
    isPaused: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
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
    },
  });

  const { isPending: sendLoading, sendTransactionAsync } = useSendTransaction();

  const handleDeposit = async () => {
    if (paymentType === PAYMENT_TYPES.NATIVE) {
      const result = await sendTransactionAsync({
        to: invoice?.address,
        value: depositAmount,
        enabled: !!amount && paymentType === PAYMENT_TYPES.NATIVE,
      });
      return result;
    }

    const result = await writeContractAsync(data.request);
    return result;
  };

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      /* eslint-disable no-console */
      console.error('useDeposit error', error);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    handleDeposit,
    isReady: paymentType === PAYMENT_TYPES.NATIVE ? true : !!writeContractAsync,
    isLoading: prepareLoading || writeLoading || sendLoading,
    writeError,
    prepareError,
  };
};

export default useDeposit;
