import { Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { ContractFunctionResult } from 'viem';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useRelease = ({
  invoice,
  milestone,
  onSuccess,
}: {
  invoice: Invoice;
  milestone?: number;
  onSuccess: (tx: ContractFunctionResult) => void;
}) => {
  const chainId = useChainId();

  const specifyMilestones = _.isNumber(milestone);

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    chainId,
    address: invoice?.address,
    abi: INVOICE_ABI,
    functionName: specifyMilestones ? 'release(uint256)' : 'release',
    args: specifyMilestones ? [milestone] : [], // optional args
    enabled: !!invoice?.address,
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
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
  });

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useRelease;
