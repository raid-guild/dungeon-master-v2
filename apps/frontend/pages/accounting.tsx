import { NextSeo } from 'next-seo';
import { Heading, Button } from '@raidguild/design-system';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';
import useTransactions from '../hooks/useTransactions';
import Papa from 'papaparse';
import _ from 'lodash';
import TransactionsTable from '../components/TransactionsTable';

export const Accounting = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data, error /* hasNextPage, fetchNextPage */ } = useTransactions({
    token,
  });
  console.log(data);

  const onExportTransactions = () => {
    const csvString = Papa.unparse(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.click();
    link.remove();
  };

  return (
    <>
      <NextSeo title="Accounting" />

      <SiteLayout
        isLoading={!data}
        data={data}
        subheader={<Heading>Accounting</Heading>}
        error={error}
      >
        <TransactionsTable data={data} />
        <Button onClick={onExportTransactions} size="sm" fontWeight="normal">
          Export Transactions
        </Button>
      </SiteLayout>
    </>
  );
};

export default Accounting;
