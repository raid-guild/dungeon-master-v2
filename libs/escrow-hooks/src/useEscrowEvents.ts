import { commify } from '@raidguild/dm-utils';
import _ from 'lodash';
import { Address, formatUnits } from 'viem';

import useInvoiceDetails from './useInvoiceDetails';

const useEscrowEvents = (invoiceAddress: Address, chainId: number) => {
  const {
    data: invoice,
    isLoading,
    error,
  } = useInvoiceDetails({
    invoiceAddress,
    chainId,
  });

  const {
    currentMilestone,
    numMilestones: totalMileStones,
    releases,
    deposits,
  } = _.pick(invoice, [
    'currentMilestone',
    'numMilestones',
    'releases',
    'deposits',
  ]);

  const mapToEscrowEvent =
    (type: 'deposit' | 'release') =>
    (event: {
      txHash?: string;
      sender?: Address;
      timestamp?: number;
      amount?: string | number | undefined;
    }) => {
      const createdAt = new Date(event.timestamp * 1000).toISOString();
      const amount = event?.amount
        ? commify(
            Number(
              formatUnits(BigInt(event.amount), invoice?.tokenMetadata.decimals)
            ).toFixed(2)
          )
        : null;
      return {
        createdAt,
        amount,
        ..._.pick(event, ['txHash', 'sender', 'milestone']),
        type,
      };
    };

  const depositEvents = _.map(deposits, mapToEscrowEvent('deposit'));
  const releaseEvents = _.map(releases, mapToEscrowEvent('release'));

  const events = [...depositEvents, ...releaseEvents];

  return {
    data: { events, totalMileStones, currentMilestone },
    isLoading,
    error,
  };
};

export default useEscrowEvents;
