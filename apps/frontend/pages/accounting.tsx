import { NextSeo } from 'next-seo';
import {
  Heading,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
} from '@raidguild/design-system';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';
import {
  useTransactions,
  useBalances,
  useTokenPrices,
} from '../hooks/useAccounting';
import Papa from 'papaparse';
import _ from 'lodash';
import TransactionsTable from '../components/TransactionsTable';
import BalancesTable from '../components/BalancesTable';
import { useMemo } from 'react';

export const Accounting = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: transactions, error: transactionsError } = useTransactions({
    token,
  });
  const { data: balances, error: balancesError } = useBalances({ token });
  const { data: tokenPrices, error: tokenPricesError } = useTokenPrices({
    token,
  });

  const onExportCsv = (type: 'transactions' | 'balances') => {
    let csvString = Papa.unparse(transactions);
    if (type === 'balances') {
      csvString = Papa.unparse(balances);
    }
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}.csv`);
    link.click();
    link.remove();
  };

  const transactionsWithPrices = useMemo(() => {
    return transactions.map((t) => {
      const formattedDate = t.date.toISOString().split('T')[0];
      const tokenSymbol = t.tokenSymbol.toLowerCase();
      if (tokenPrices[tokenSymbol] && tokenPrices[tokenSymbol][formattedDate]) {
        return {
          ...t,
          priceConversion: tokenPrices[tokenSymbol][formattedDate],
        };
      } else if (tokenSymbol.includes('xdai')) {
        return {
          ...t,
          priceConversion: 1,
        };
      }
      return t;
    });
  }, [tokenPrices, transactions]);

  return (
    <>
      <NextSeo title='Accounting' />

      <SiteLayout
        isLoading={!(transactions && balances)}
        data={[...transactions, ...balances]}
        subheader={<Heading>Accounting</Heading>}
        emptyDataPhrase='No transactions'
        error={transactionsError || balancesError || tokenPricesError}
      >
        <Tabs align='center' colorScheme='whiteAlpha' variant='soft-rounded'>
          <TabList>
            <Tab>
              <Heading size='sm'>Balances</Heading>
            </Tab>
            <Tab>
              <Heading size='sm'>Transactions</Heading>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex
                alignItems='right'
                justifyContent='right'
                marginBlock='20px'
              >
                <Button
                  onClick={() => onExportCsv('balances')}
                  size='sm'
                  fontWeight='normal'
                >
                  Export Balances
                </Button>
              </Flex>
              <BalancesTable data={balances} />
            </TabPanel>
            <TabPanel>
              <Flex
                alignItems='right'
                justifyContent='right'
                marginBlock='20px'
              >
                <Button
                  onClick={() => onExportCsv('transactions')}
                  size='sm'
                  fontWeight='normal'
                >
                  Export Transactions
                </Button>
              </Flex>
              <TransactionsTable data={transactionsWithPrices} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SiteLayout>
    </>
  );
};

export default Accounting;
