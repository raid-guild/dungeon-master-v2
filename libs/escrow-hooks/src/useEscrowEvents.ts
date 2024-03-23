import { Address } from 'viem';
import useInvoiceDetails from './useInvoiceDetails';
import _ from 'lodash';

interface escrowEvent {
  amount: number;
  txHash: Address;
  timestamp: number;
  sender?: Address;
  milestone?: number;
  type: 'release' | 'deposit' | 'lock' | 'other';
}

const useEscrowEvents = (invoiceAddress: Address) => {
  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useInvoiceDetails({
    invoiceAddress: invoiceAddress,
    chainId: 100, // chain?.id, // ! support multiple chains
  });

  const { currentMilestone } = _.pick(invoice, 'currentMilestone');
  const { numMileStones: totalMileStones } = _.pick(invoice, 'numMileStones');
  const { releases } = _.pick(invoice, 'releases');
  const { deposits } = _.pick(invoice, 'deposits');
  const { createdAt } = _.pick(invoice, 'createdAt');

  // get  {amount, sender, timestamp, txHash } from deposits
  // use lodash
  const depositEvents = _.map(
    deposits,
    ({ txHash, amount, sender, timestamp }) =>
      ({
        txHash,
        amount,
        sender,
        type: 'deposit',
        timestamp,
      } as escrowEvent)
  );

  const releaseEvents = _.map(
    releases,
    ({ txHash, amount, milestone, timestamp }) =>
      ({
        txHash,
        amount,
        milestone,
        type: 'release',
        timestamp,
      } as escrowEvent)
  );

  const events = [...depositEvents, ...releaseEvents];

  return { events };
};

export default useEscrowEvents;
