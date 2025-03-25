/* eslint-disable simple-import-sort/imports */
import {
  Button,
  Flex,
  Heading,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@raidguild/design-system';
import {
  useMemberList,
  useFormattedAccountingV3,
  useAccountingV3,
} from '@raidguild/dm-hooks';
import { exportToCsv } from '@raidguild/dm-utils';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import Papa from 'papaparse';
import { useCallback } from 'react';
import _ from 'lodash';

import BalancesTable from '../components/BalancesTable';
import SiteLayout from '../components/SiteLayout';
import SpoilsTable from '../components/SpoilsTable';
import TransactionsTable from '../components/TransactionsTable';

export const Accounting = () => {
  const { data: session } = useSession();

  const token = _.get(session, 'token');

  const { data: memberData } = useMemberList({
    token,
    limit: 1000,
  });

  const { loading, isError, error } = useAccountingV3();

  const {
    formattedSpoils: formattedSpoilsV3,
    members,
    balancesWithPrices: balancesWithPricesV3,
    transactionsWithPrices: transactionsWithPricesV3,
    transactionsWithPricesAndMembers: transactionsWithPricesAndMembersV3,
  } = useFormattedAccountingV3(memberData);

  const onExportCsv = useCallback(
    (type: 'transactions' | 'balances' | 'spoils') => {
      let csvString = '';
      if (type === 'transactions') {
        const formattedTransactions = transactionsWithPricesV3.map((t) => ({
          Date: t.date,
          'Tx Explorer Link': t.txExplorerLink,
          'Elapsed Days': t.elapsedDays,
          Type: t.type,
          Applicant: t.proposalApplicant,
          'Applicant Member':
            members[t.proposalApplicant.toLowerCase()]?.name || '-',
          Shares: t.proposalShares,
          Loot: t.proposalLoot,
          Title: t.proposalTitle,
          Counterparty: t.counterparty,
          'Counterparty Member':
            members[t.counterparty.toLowerCase()]?.name || '-',
          'Token Symbol': t.tokenSymbol,
          'Token Decimals': t.tokenDecimals,
          'Token Address': t.tokenAddress,
          Inflow: t.in,
          'Inflow USD': t.priceConversion
            ? `$${(t.in * t.priceConversion).toLocaleString()}`
            : '$-',
          Outflow: t.out,
          'Outflow USD': t.priceConversion
            ? `$${(t.out * t.priceConversion).toLocaleString()}`
            : '$-',
          Balance: t.balance,
          'Balance USD': t.priceConversion
            ? `$${(t.balance * t.priceConversion).toLocaleString()}`
            : '$-',
        }));
        csvString = Papa.unparse(formattedTransactions);
      } else if (type === 'balances') {
        if (type === 'balances') {
          const formattedBalances = balancesWithPricesV3.map((b) => ({
            Token: b.tokenSymbol,
            'Tx Explorer Link': b.tokenExplorerLink,
            Inflow: b.inflow.tokenValue,
            'Inflow USD': b.priceConversion
              ? `$${(
                  Number(b.inflow.tokenValue) * b.priceConversion
                ).toLocaleString()}`
              : '$-',
            Outflow: b.outflow.tokenValue,
            'Outflow USD': b.priceConversion
              ? `$${(
                  Number(b.outflow.tokenValue) * b.priceConversion
                ).toLocaleString()}`
              : '$-',
            Balance: b.closing.tokenValue,
            'Balance USD': b.priceConversion
              ? `$${(
                  Number(b.closing.tokenValue) * b.priceConversion
                ).toLocaleString()}`
              : '$-',
          }));
          csvString = Papa.unparse(formattedBalances);
        }
      } else if (type === 'spoils') {
        const formattedSpoils = formattedSpoilsV3.map((s) => ({
          Date: s.date,
          Raid: s.raidName,
          // TODO: Get this dynamically from the subgraph
          'Token Symbol': 'wxDAI',
          'To DAO Treasury': `$${s.parentShare.toLocaleString()}`,
          'To Raid Party': `$${s.childShare.toLocaleString()}`,
        }));
        csvString = Papa.unparse(formattedSpoils);
      }
      exportToCsv(csvString, `raidguild-treasury-${type}`);
    },
    [balancesWithPricesV3, members, formattedSpoilsV3, transactionsWithPricesV3]
  );

  return (
    <>
      <NextSeo title='Accounting' />

      <SiteLayout
        isLoading={loading}
        data={[
          ...transactionsWithPricesV3,
          ...transactionsWithPricesAndMembersV3,
          ...balancesWithPricesV3,
          // ...Object.values(tokenPrices),
        ]}
        subheader={<Heading>Accounting</Heading>}
        emptyDataPhrase='No transactions'
        error={error && isError}
      >
        <Text>
          View Dune Dashboard metrics{' '}
          <Link
            color='red.500'
            href='https://dune.com/sunsakis/raidguild'
            rel='noreferrer noopener'
            target='_blank'
            _hover={{
              color: 'red.300',
              textDecoration: 'underline',
            }}
          >
            here
          </Link>
          .
        </Text>
        <Tabs align='center' colorScheme='whiteAlpha' variant='soft-rounded'>
          <TabList>
            <Tab>
              <Heading size='sm'>Balances</Heading>
            </Tab>
            <Tab>
              <Heading size='sm'>Transactions</Heading>
            </Tab>
            <Tab>
              <Heading size='sm'>Spoils</Heading>
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
              <BalancesTable data={balancesWithPricesV3} />
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
              <TransactionsTable data={transactionsWithPricesV3} />
            </TabPanel>
            <TabPanel>
              <Flex
                alignItems='right'
                justifyContent='right'
                marginBlock='20px'
              >
                <Button
                  onClick={() => onExportCsv('spoils')}
                  size='sm'
                  fontWeight='normal'
                >
                  Export Spoils
                </Button>
              </Flex>
              <SpoilsTable data={formattedSpoilsV3} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SiteLayout>
    </>
  );
};

export default Accounting;
