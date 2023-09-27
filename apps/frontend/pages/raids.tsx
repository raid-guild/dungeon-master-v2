/* eslint-disable dot-notation */
/* eslint-disable react/no-unstable-nested-components */
import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  Heading,
  Spinner,
  Flex,
  FormLabel,
  ChakraSelect,
  Text,
  Spacer,
  HStack,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import {
  useDefaultTitle,
  useRaidList,
  useRaidsCount,
} from '@raidguild/dm-hooks';
import { IRaid, RAID_STATUS, GUILD_CLASS_OPTIONS } from '@raidguild/dm-utils';
import { raidSortKeys } from '@raidguild/dm-types';
import RaidCard from '../components/RaidCard';
import SiteLayout from '../components/SiteLayout';

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

const raidSortOptions = [
  { label: 'Oldest Comment', value: 'oldestComment' },
  { label: 'Recent Comment', value: 'recentComment' },
  { label: 'Recently Updated', value: 'recentlyUpdated' },
  { label: 'Name', value: 'name' },
  { label: 'Start Date', value: 'startDate' },
  { label: 'End Date', value: 'endDate' },
  { label: 'Create Date', value: 'createDate' },
];

const RaidList = () => {
  const [raidStatusFilter, setRaidStatusFilter] = useState<string>('ACTIVE');
  const [raidSort, setRaidSort] = useState<raidSortKeys>('oldestComment');
  const [raidRolesFilter, setRaidRolesFilter] = useState<string>('ALL');
  const [sortChanged, setSortChanged] = useState(false);
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const handleRaidStatusFilterChange = async (status: string) => {
    setRaidStatusFilter(status);
  };

  const handleRaidRolesFilterChange = async (role: string) => {
    setRaidRolesFilter(role);
  };

  const handleRaidSortChange = async (sortOption: raidSortKeys) => {
    setRaidSort(sortOption);
    setSortChanged(true);
    if (sortOption === 'oldestComment') {
      setRaidStatusFilter('ACTIVE');
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
          defaultValue='Active'
          onChange={(e) => {
            handleRaidStatusFilterChange(e.target.value);
            if (raidSort === 'oldestComment') {
              handleRaidStatusFilterChange('ACTIVE');
            }
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
          defaultValue='Show All'
          onChange={(e) => {
            handleRaidRolesFilterChange(e.target.value);
            if (sortChanged === true && raidSort === 'oldestComment') {
              setRaidStatusFilter('ACTIVE');
            }
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
          defaultValue='Name'
          onChange={(e) => {
            handleRaidSortChange(e.target.value as raidSortKeys);
            if (e.target.value === 'oldestComment') {
              handleRaidStatusFilterChange('ACTIVE');
            }
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
    raidStatusFilterKey: raidStatusFilter,
    raidRolesFilterKey: raidRolesFilter,
    raidSortKey: raidSort,
  });
  const { data: count } = useRaidsCount({
    token,
    raidStatusFilterKey: raidStatusFilter,
    raidRolesFilterKey: raidRolesFilter,
    raidSortKey: raidSort,
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
              <Heading variant='noShadow'>{title}</Heading>
              <Spacer />
              {count > 0 && (
                <HStack alignItems={'baseline'} gap={1}>
                  <Text fontSize='3xl' fontWeight={800}>
                    {count}
                  </Text>
                  <Text fontSize='sm' fontWeight={'normal'}>
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
