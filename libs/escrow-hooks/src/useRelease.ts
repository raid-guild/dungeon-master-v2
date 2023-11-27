import { Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useRelease = ({
  invoice,
  milestone,
}: {
  invoice: Invoice;
  milestone?: number;
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
      console.log('deposit tx', tx);

      // handle success
      // close modal
      // update invoice with new balances
    },
    onError: async (error) => {
      console.log('deposit error', error);
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
