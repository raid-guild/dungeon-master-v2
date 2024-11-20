import { Invoice } from '@raidguild/escrow-utils';
import { WriteContractReturnType } from '@wagmi/core';
import _ from 'lodash';
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

  return {
    writeAsync: () => writeContractAsync(data.request),
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useRelease;
