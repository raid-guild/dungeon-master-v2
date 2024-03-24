import { Address, parseEther } from 'viem';
import useInvoiceDetails from './useInvoiceDetails';
import _ from 'lodash';
import { formatUnits } from 'viem';
import { commify } from '@raidguild/dm-utils';

const useEscrowEvents = (invoiceAddress: Address) => {
  const {
    data: invoice,
    isLoading,
    error,
  } = useInvoiceDetails({
    invoiceAddress,
    chainId: 100,
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
        ? commify((parseFloat(String(event?.amount)) / 10 ** 18).toFixed(2))
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
