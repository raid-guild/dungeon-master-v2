import { wagmiConfig } from '@raidguild/dm-utils';
import { Invoice } from '@raidguild/escrow-utils';
import { waitForTransactionReceipt } from '@wagmi/core';
import _ from 'lodash';
import { useState } from 'react';
import { Hex } from 'viem';
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import INVOICE_ABI from './contracts/Invoice.json';

const useLock = ({
  invoice,
  disputeReason,
  amount,
}: {
  invoice: Invoice;
  disputeReason: string;
  amount: string;
}) => {
  console.log('useLock', invoice);

  const detailsHash =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);

  // const detailsHash = await uploadDisputeDetails({
  //   reason: disputeReason,
  //   invoice: address,
  //   amount: balance.toString(),
  // });

  const { data: txResult } = useWaitForTransactionReceipt({ hash: txHash });

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    address: invoice.address as Hex,
    functionName: 'lock',
    abi: INVOICE_ABI,
    args: [detailsHash],
    enabled: !!invoice?.address && !!disputeReason,
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async (hash) => {
        console.log('success', hash);
        setTxHash(hash);

        const result = await waitForTransactionReceipt(wagmiConfig, {
          hash,
        });

        // handle success
        // close modal
        // update invoice with status
      },
      onError: (error) => {
        console.log('error', error);
      },
    },
  });

  return {
    writeAsync: () => writeContractAsync(data.request),
    isLoading: prepareLoading || writeLoading,
    txHash,
    writeLoading,
    prepareError,
    writeError,
  };
};

export default useLock;
