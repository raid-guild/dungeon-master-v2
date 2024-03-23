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
    createdAt,
  } = _.pick(invoice, [
    'currentMilestone',
    'numMilestones',
    'releases',
    'deposits',
    'createdAt',
  ]);

  const mapToEscrowEvent = (type) => (event: any) => {
    const createdAt = new Date(event.timestamp * 1000).toISOString();
    const amount = `${commify(
      formatUnits(parseEther(event?.amount)) * 10 ** 4
    )}`;

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
    data: { events, totalMileStones, currentMilestone, createdAt },
    isLoading,
    error,
  };
};

export default useEscrowEvents;
