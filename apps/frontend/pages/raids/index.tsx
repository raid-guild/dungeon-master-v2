/* eslint-disable dot-notation */
/* eslint-disable react/no-unstable-nested-components */
import {
  ChakraSelect,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Stack,
  Text,
} from '@raidguild/design-system';
import {
  useDefaultTitle,
  useRaidList,
  useRaidsCount,
} from '@raidguild/dm-hooks';
import { IRaid, raidSortKeys } from '@raidguild/dm-types';
import { GUILD_CLASS_OPTIONS, RAID_STATUS } from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import RaidCard from '../../components/RaidCard';
import SiteLayout from '../../components/SiteLayout';

const raidStatusMapped = RAID_STATUS.map((status) => ({
  label: status,
  value: status.toUpperCase(),
}));

const raidStatusOptions = [
  ...[{ label: 'Active', value: 'ACTIVE' }],
  ...[{ label: 'Show All', value: 'ALL' }],
  ...raidStatusMapped,
];

const raidRolesOptions = [
  ...[{ label: 'Show All', value: 'ALL' }],
  ...[{ label: 'Any Role Set', value: 'ANY_ROLE_SET' }],
  ...GUILD_CLASS_OPTIONS,
];

const raidPortfolioStatusOptions = [
  { label: 'Show All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Pending', value: 'PENDING' },
];

const raidSortOptions = [
  { label: 'Oldest Comment', value: 'oldestComment' },
  { label: 'Recent Comment', value: 'recentComment' },
  // { label: 'Recently Updated', value: 'recentlyUpdated' },
  { label: 'Name', value: 'name' },
  { label: 'Start Date', value: 'startDate' },
  { label: 'End Date', value: 'endDate' },
  { label: 'Created Date', value: 'createDate' },
];

const RaidList = () => {
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const [raidStatusFilter, setRaidStatusFilter] = useState<string>('ACTIVE');
  const [raidRolesFilter, setRaidRolesFilter] = useState<string>('ALL');
  const [raidPortfolioStatusFilter, setRaidPortfolioStatusFilter] =
    useState<string>('ALL');
  const [raidSort, setRaidSort] = useState<raidSortKeys>('oldestComment');

  const handleRaidStatusFilterChange = async (status: string) => {
    setRaidStatusFilter(status);
    if (raidSort === 'oldestComment' || raidSort === 'recentComment') {
      setRaidSort('name');
    }
  };
  const handleRaidRolesFilterChange = async (role: string) => {
    setRaidRolesFilter(role);
    if (raidSort === 'oldestComment' || raidSort === 'recentComment') {
      setRaidSort('name');
    }
  };

  const handleRaidPortfolioStatusChange = async (status: string) => {
    setRaidPortfolioStatusFilter(status);
    // todo; test if requires useMemo
    if (status === 'PUBLISHED') {
      setRaidStatusFilter('SHIPPED');
    }
  };

  const handleRaidSortFilterChange = async (sortOption: raidSortKeys) => {
    setRaidSort(sortOption);
    if (sortOption === 'oldestComment' || sortOption === 'recentComment') {
      setRaidStatusFilter('ACTIVE');
      setRaidRolesFilter('ALL');
    }
  };

  // TODO: generalize and move to separate file -- will need to pass options and filter state
  const RaidControls = () => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
      width={['90%', null, null, '100%']}
      gap={[2, 4, 4, 8]}
    >
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='raidStatus'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Raid Status
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='raidStatus'
          value={raidStatusFilter}
          onChange={(e) => {
            handleRaidStatusFilterChange(e.target.value);
          }}
        >
          {raidStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='raidRoles'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Raid Roles
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='raidRoles'
          id='raidRoles'
          value={raidRolesFilter}
          onChange={(e) => {
            handleRaidRolesFilterChange(e.target.value);
          }}
        >
          {raidRolesOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='raidPortfolioStatus'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Raid Portfolio
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='raidPortfolioStatus'
          id='raidPortfolioStatus'
          value={raidPortfolioStatusFilter}
          onChange={(e) => {
            handleRaidPortfolioStatusChange(e.target.value);
          }}
        >
          {raidPortfolioStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='raidSort'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Sort
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='raidSort'
          value={raidSort}
          onChange={(e) => {
            handleRaidSortFilterChange(e.target.value as raidSortKeys);
          }}
        >
          {raidSortOptions.map((sortOption) => (
            <option key={sortOption.value} value={sortOption.value}>
              {sortOption.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
    </Flex>
  );

  const { data, error, fetchNextPage, hasNextPage } = useRaidList({
    token,
    raidPortfolioStatusFilterKey: raidPortfolioStatusFilter,
    raidStatusFilterKey: raidStatusFilter,
    raidRolesFilterKey: raidRolesFilter,
    raidSortKey: raidSort,
  });
  const { data: count } = useRaidsCount({
    token,
    raidStatusFilterKey: raidStatusFilter,
    raidRolesFilterKey: raidRolesFilter,
    raidSortKey: raidSort,
    raidPortfolioStatusFilterKey: raidPortfolioStatusFilter,
  });

  const raids = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title='Raids List' />

      <SiteLayout
        isLoading={!data}
        data={raids}
        subheader={
          <>
            <Flex w='100%' align='center'>
              <Heading>{title}</Heading>
              <Spacer />
              {count > 0 && (
                <HStack alignItems='baseline' gap={1}>
                  <Text fontSize='3xl' fontWeight={800}>
                    {count}
                  </Text>
                  <Text fontSize='sm' fontWeight='normal'>
                    raid{count > 1 ? 's' : ''}
                  </Text>
                </HStack>
              )}
            </Flex>
            <RaidControls />
          </>
        }
        error={error}
      >
        <InfiniteScroll
          pageStart={0}
          style={{ width: '100%' }}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Flex my={25} w='100%' justify='center' key={1}>
              <Spinner size='xl' my={50} />
            </Flex>
          }
        >
          <Stack spacing={4} mx='auto' key={2} w='100%'>
            {_.map(raids, (raid: IRaid) => (
              <RaidCard
                raid={raid}
                consultation={_.get(raid, 'consultation')}
                key={_.get(raid, 'id')}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default RaidList;
