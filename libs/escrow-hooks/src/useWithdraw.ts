import { Invoice } from '@raidguild/escrow-utils';

const useWithdraw = ({ invoice }: { invoice: Invoice }) => {
  console.log('useWithdraw', invoice);
};

export default useWithdraw;
