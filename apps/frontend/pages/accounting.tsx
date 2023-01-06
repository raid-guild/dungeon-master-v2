import React from 'react';
import { NextSeo } from 'next-seo';
import { Heading, Button, Flex } from '@raidguild/design-system';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';
import { useTransactions, useBalances } from '../hooks/useAccounting';
import Papa from 'papaparse'
import _ from 'lodash';

export const Accounting: React.FC = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: transactions, error: transactionsError  } = useTransactions({
    token,
  });
  const { data: balances, error: balancesError } = useBalances({ token });

  const onExportCsv = (type: 'transactions' | 'balances') => {
    let csvString = Papa.unparse(transactions)
    if (type === 'balances') {
      csvString = Papa.unparse(balances)
    }
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}.csv`);
    link.click();
    link.remove();
  }

  return (
    <>
      <NextSeo title="Accounting" />

      <SiteLayout
        isLoading={!(transactions && balances)}
        data={null}
        subheader={<Heading>Accounting</Heading>}
        error={transactionsError || balancesError}
      >
      <Flex gap="16px">
        <Button
          onClick={() => onExportCsv('transactions')}
          size="sm"
          fontWeight="normal"
        >
          Export Transactions
        </Button>
        <Button
          onClick={() => onExportCsv('balances')}
          size="sm"
          fontWeight="normal"
        >
          Export Balances
        </Button>
      </Flex>
      </SiteLayout>
    </>
  )
}

export default Accounting
