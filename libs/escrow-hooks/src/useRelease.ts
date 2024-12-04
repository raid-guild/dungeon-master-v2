import { Invoice } from '@raidguild/escrow-utils';
import { WriteContractReturnType } from '@wagmi/core';
import _ from 'lodash';
import { useCallback } from 'react';
import { Hex } from 'viem';
import { useChainId, useSimulateContract, useWriteContract } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useRelease = ({
  invoice,
  milestone,
  onSuccess,
}: {
  invoice: Invoice;
  milestone?: number;
  onSuccess: (tx: WriteContractReturnType) => void;
}) => {
  const chainId = useChainId();

  const specifyMilestones = _.isNumber(milestone);

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    chainId,
    address: invoice?.address,
    abi: INVOICE_ABI,
    functionName: specifyMilestones ? 'release(uint256)' : 'release',
    args: specifyMilestones ? [milestone] : [], // optional args
    enabled: !!invoice?.address,
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async (tx) => {
        onSuccess(tx);

        // handle success
        // close modal
        // update invoice with new balances
      },
      onError: async (error) => {
        // eslint-disable-next-line no-console
        console.log('release error', error);
      },
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      /* eslint-disable no-console */
      console.error('useRelease error', error);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useRelease;
