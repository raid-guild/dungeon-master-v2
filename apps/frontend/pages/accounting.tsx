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
import { GUILD_GNOSIS_DAO_ADDRESS, REGEX_ETH_ADDRESS } from '../utils';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const Accounting = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: transactions, error: transactionsError } = useTransactions({
    token,
  });
  const { data: balances, error: balancesError } = useBalances({
    token,
    startFetch: transactions.length > 0 ? true : false,
  });
  const { data: tokenPrices, error: tokenPricesError } = useTokenPrices({
    token,
  });
  const { data: memberData } = useMemberList({
    token,
    limit: 1000,
  });

  const members = useMemo(() => {
    const memberArray = _.flatten(_.get(memberData, 'pages')) as IMember[];
    return _.keyBy(memberArray, (m: IMember) => m.ethAddress.toLowerCase());
  }, [memberData]);

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
        const memberLink = m?.ethAddress.match(REGEX_ETH_ADDRESS)
          ? `https://app.daohaus.club/dao/0x64/${GUILD_GNOSIS_DAO_ADDRESS}/profile/${ethAddress}`
          : undefined;

        return {
          ...t,
          memberLink,
          memberName: m?.name,
          memberEnsName: m?.ensName,
        };
      }),
    [transactionsWithPrices, members]
  );

  const onExportCsv = (type: 'transactions' | 'balances') => {
    const formattedTransactions = transactionsWithPrices.map((t) => ({
      ['Date']: t.date,
      ['Tx Explorer Link']: t.txExplorerLink,
      ['Elapsed Days']: t.elapsedDays,
      ['Type']: t.type,
      ['Applicant']: t.proposalApplicant,
      ['Applicant Member']:
        members[t.proposalApplicant.toLowerCase()]?.name || '-',
      ['Shares']: t.proposalShares,
      ['Loot']: t.proposalLoot,
      ['Title']: t.proposalTitle,
      ['Counterparty']: t.counterparty,
      ['Counterparty Member']:
        members[t.counterparty.toLowerCase()]?.name || '-',
      ['Token Symbol']: t.tokenSymbol,
      ['Token Decimals']: t.tokenDecimals,
      ['Token Address']: t.tokenAddress,
      ['Inflow']: t.in,
      ['Inflow USD']: t.priceConversion
        ? `$${(t.in * t.priceConversion).toLocaleString()}`
        : '$-',
      ['Outflow']: t.out,
      ['Outflow USD']: t.priceConversion
        ? `$${(t.out * t.priceConversion).toLocaleString()}`
        : '$-',
      ['Balance']: t.balance,
      ['Balance USD']: t.priceConversion
        ? `$${(t.balance * t.priceConversion).toLocaleString()}`
        : '$-',
    }));

    let csvString = Papa.unparse(formattedTransactions);
    if (type === 'balances') {
      const formattedBalances = balancesWithPrices.map((b) => ({
        ['Token']: b.tokenSymbol,
        ['Tx Explorer Link']: b.tokenExplorerLink,
        ['Inflow']: b.inflow.tokenValue,
        ['Inflow USD']: b.priceConversion
          ? `$${(b.inflow.tokenValue * b.priceConversion).toLocaleString()}`
          : '$-',
        ['Outflow']: b.outflow.tokenValue,
        ['Outflow USD']: b.priceConversion
          ? `$${(b.outflow.tokenValue * b.priceConversion).toLocaleString()}`
          : '$-',
        ['Balance']: b.closing.tokenValue,
        ['Balance USD']: b.priceConversion
          ? `$${(b.closing.tokenValue * b.priceConversion).toLocaleString()}`
          : '$-',
      }));
      csvString = Papa.unparse(formattedBalances);
    }
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}.csv`);
    link.click();
    link.remove();
  };

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
              <Heading size='sm' variant='noShadow'>
                Balances
              </Heading>
            </Tab>
            <Tab>
              <Heading size='sm' variant='noShadow'>
                Transactions
              </Heading>
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
