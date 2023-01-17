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
import useMemberList from '../hooks/useMemberList';
import Papa from 'papaparse';
import _ from 'lodash';
import TransactionsTable from '../components/TransactionsTable';
import BalancesTable from '../components/BalancesTable';
import { useCallback, useMemo } from 'react';
import { IMember, ITokenBalanceLineItem, IVaultTransaction } from '../types';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

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
  const { data: memberData } = useMemberList({
    token,
    limit: 1000,
  });
  const memberArray = _.flatten(_.get(memberData, 'pages')) as IMember[];
  const members = useMemo(
    () =>
      Object.assign(
        new Map<string, IMember>(),
        memberArray.map((m: IMember) => ({ [m.ethAddress.toLowerCase()]: m }))
      ),
    [memberArray]
  );

  // console.log('members', memberArray, members);

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

  const withPrices = useCallback(
    <T extends ITokenBalanceLineItem | IVaultTransaction>(items: T[]) =>
      items.map((t) => {
        const formattedDate = formatDate(t.date);
        const tokenSymbol = t.tokenSymbol.toLowerCase();
        if (
          tokenPrices[tokenSymbol] &&
          tokenPrices[tokenSymbol][formattedDate]
        ) {
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
      }),
    [tokenPrices]
  );

  const balancesWithPrices = useMemo(
    () => withPrices(balances),
    [balances, withPrices]
  );

  const transactionsWithPrices = useMemo(
    () => withPrices(transactions),
    [transactions, withPrices]
  );

  const transactionsWithPricesAndMembers = useMemo(
    () =>
      transactionsWithPrices.map((t) => {
        const ethAddress = t.proposalApplicant.toLowerCase();
        const m = members[ethAddress];
        if (ethAddress === '0xccc9d33567912c9d4446ad2298e74084c0e356ee')
          console.log("ethAddress:", ethAddress, "member:", m);

        return {
          ...t,
          // memberLink: m.,
          memberName: m?.name,
          memberEnsName: m?.ensName,
        };
      }),
    [transactionsWithPrices, members]
  );

  return (
    <>
      <NextSeo title='Accounting' />

      <SiteLayout
        isLoading={!(transactionsWithPricesAndMembers && balances)}
        data={[...transactionsWithPricesAndMembers, ...balances]}
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
              <BalancesTable data={balancesWithPrices} />
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
              <TransactionsTable data={transactionsWithPricesAndMembers} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SiteLayout>
    </>
  );
};

export default Accounting;
