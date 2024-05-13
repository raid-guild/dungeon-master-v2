/* eslint-disable no-useless-computed-key */
import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@raidguild/design-system';
import {
  useAccounting,
  useFormattedData,
  useMemberList,
} from '@raidguild/dm-hooks';
import { exportToCsv } from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import Papa from 'papaparse';
import { useCallback } from 'react';

import BalancesTable from '../components/BalancesTable';
import SiteLayout from '../components/SiteLayout';
import SpoilsTable from '../components/SpoilsTable';
import TransactionsTable from '../components/TransactionsTable';

export const Accounting = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data, loading, error } = useAccounting({
    token,
  });
  const { data: memberData } = useMemberList({
    token,
    limit: 1000,
  });

  const { balances, spoils, transactions, tokenPrices } = data;

  const {
    members,
    balancesWithPrices,
    transactionsWithPrices,
    transactionsWithPricesAndMembers,
  } = useFormattedData(memberData, balances, transactions, tokenPrices);

  const onExportCsv = useCallback(
    (type: 'transactions' | 'balances' | 'spoils') => {
      let csvString = '';
      if (type === 'transactions') {
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
        csvString = Papa.unparse(formattedTransactions);
      } else if (type === 'balances') {
        if (type === 'balances') {
          const formattedBalances = balancesWithPrices.map((b) => ({
            ['Token']: b.tokenSymbol,
            ['Tx Explorer Link']: b.tokenExplorerLink,
            ['Inflow']: b.inflow.tokenValue,
            ['Inflow USD']: b.priceConversion
              ? `$${(
                  Number(b.inflow.tokenValue) * b.priceConversion
                ).toLocaleString()}`
              : '$-',
            ['Outflow']: b.outflow.tokenValue,
            ['Outflow USD']: b.priceConversion
              ? `$${(
                  Number(b.outflow.tokenValue) * b.priceConversion
                ).toLocaleString()}`
              : '$-',
            ['Balance']: b.closing.tokenValue,
            ['Balance USD']: b.priceConversion
              ? `$${(
                  Number(b.closing.tokenValue) * b.priceConversion
                ).toLocaleString()}`
              : '$-',
          }));
          csvString = Papa.unparse(formattedBalances);
        }
      } else if (type === 'spoils') {
        const formattedSpoils = spoils.map((s) => ({
          ['Date']: s.date,
          ['Raid']: s.raidName,
          // TODO: Get this dynamically from the subgraph
          ['Token Symbol']: 'wxDAI',
          ['To DAO Treasury']: `$${s.parentShare.toLocaleString()}`,
          ['To Raid Party']: `$${s.childShare.toLocaleString()}`,
        }));
        csvString = Papa.unparse(formattedSpoils);
      }
      exportToCsv(csvString, `raidguild-treasury-${type}`);
    },
    [balancesWithPrices, members, spoils, transactionsWithPrices]
  );

  return (
    <>
      <NextSeo title='Accounting' />

      <SiteLayout
        isLoading={loading}
        data={[
          ...transactionsWithPricesAndMembers,
          ...balances,
          ...Object.values(tokenPrices),
        ]}
        subheader={<Heading>Accounting</Heading>}
        emptyDataPhrase='No transactions'
        error={error}
      >
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
              <Tabs
                align='start'
                colorScheme='whiteAlpha'
                variant='unstyled'
                defaultIndex={0}
              >
                <Flex
                  alignItems='right'
                  justifyContent='space-between'
                  marginBlock='20px'
                >
                  <TabList>
                    <Tab>
                      <Heading size='sm'>V3 (current)</Heading>
                    </Tab>
                    <Tab>
                      <Heading size='sm'>V2</Heading>
                    </Tab>
                  </TabList>
                  <Button
                    onClick={() => onExportCsv('balances')}
                    size='sm'
                    fontWeight='normal'
                  >
                    Export Balances
                  </Button>
                </Flex>

                <TabPanels>
                  <TabPanel>
                    <BalancesTable data={balancesWithPrices} />
                  </TabPanel>
                  <TabPanel>
                    <div>This is the placeholder for v3 balances data.</div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
            <TabPanel>
              <Tabs
                align='start'
                colorScheme='whiteAlpha'
                variant='unstyled'
                defaultIndex={0}
              >
                <Flex
                  alignItems='right'
                  justifyContent='space-between'
                  marginBlock='20px'
                >
                  <TabList>
                    <Tab>
                      <Heading size='sm'>V3 (current)</Heading>
                    </Tab>
                    <Tab>
                      <Heading size='sm'>V2</Heading>
                    </Tab>
                  </TabList>
                  <Button
                    onClick={() => onExportCsv('transactions')}
                    size='sm'
                    fontWeight='normal'
                  >
                    Export Transactions
                  </Button>
                </Flex>

                <TabPanels>
                  <TabPanel>
                    <TransactionsTable
                      data={transactionsWithPricesAndMembers}
                    />
                  </TabPanel>
                  <TabPanel>
                    <div>This is the placeholder for v3 transactions data.</div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
            <TabPanel>
              <Tabs
                align='start'
                colorScheme='whiteAlpha'
                variant='unstyled'
                defaultIndex={0}
              >
                <Flex
                  alignItems='right'
                  justifyContent='space-between'
                  marginBlock='20px'
                >
                  <TabList>
                    <Tab>
                      <Heading size='sm'>V3 (current)</Heading>
                    </Tab>
                    <Tab>
                      <Heading size='sm'>V2</Heading>
                    </Tab>
                  </TabList>
                  <Button
                    onClick={() => onExportCsv('spoils')}
                    size='sm'
                    fontWeight='normal'
                  >
                    Export Spoils
                  </Button>
                </Flex>

                <TabPanels>
                  <TabPanel>
                    <SpoilsTable data={spoils} />
                  </TabPanel>
                  <TabPanel>
                    <div>This is the placeholder for v3 spoils data.</div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SiteLayout>
    </>
  );
};

export default Accounting;
