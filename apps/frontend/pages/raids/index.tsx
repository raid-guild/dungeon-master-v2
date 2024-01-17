/* eslint-disable dot-notation */
/* eslint-disable react/no-unstable-nested-components */
import {
  Flex,
  Heading,
  HStack,
  Option,
  Select,
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
import { IRaid } from '@raidguild/dm-types';
import { GUILD_CLASS_OPTIONS, RAID_STATUS } from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroller';

import RaidCard from '../../components/RaidCard';
import SiteLayout from '../../components/SiteLayout';

const raidStatusMapped = RAID_STATUS.map((status) => ({
  label: status,
  value: status.toUpperCase(),
}));

const raidStatusOptions = [
  ...[{ label: 'Show All', value: 'ALL' }],
  ...[{ label: 'Active', value: 'ACTIVE' }],
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

  const [raidStatusFilter, setRaidStatusFilter] = useState<Option>(
    raidPortfolioStatusOptions.find((x) => x.value === 'ALL')
  );
  const [raidRolesFilter, setRaidRolesFilter] = useState<Option>(
    raidRolesOptions.find((x) => x.value === 'ALL')
  );
  const [raidPortfolioStatusFilter, setRaidPortfolioStatusFilter] =
    useState<Option>(raidPortfolioStatusOptions.find((x) => x.value === 'ALL'));
  const [raidSort, setRaidSort] = useState<Option>(
    raidSortOptions.find((x) => x.value === 'oldestComment')
  );

  const localForm = useForm({
    mode: 'all',
  });

  const { watch } = localForm;

  watch('all');
  const handleRaidStatusFilterChange = async (status: Option) => {
    setRaidStatusFilter(status);
    if (
      raidSort.value === 'oldestComment' ||
      raidSort.value === 'recentComment'
    ) {
      setRaidSort(raidSortOptions.find((x) => x.value === 'name'));
    }
  };
  const handleRaidRolesFilterChange = async (role: Option) => {
    setRaidRolesFilter(role);
    if (
      raidSort.value === 'oldestComment' ||
      raidSort.value === 'recentComment'
    ) {
      setRaidSort(raidSortOptions.find((x) => x.value === 'name'));
    }
  };

  const handleRaidPortfolioStatusChange = async (status: Option) => {
    setRaidPortfolioStatusFilter(status);
    if (raidPortfolioStatusFilter.value !== 'ALL') {
      setRaidRolesFilter(raidRolesOptions.find((x) => x.value === 'ALL'));
      setRaidStatusFilter(raidStatusOptions.find((x) => x.value === 'SHIPPED'));
    }
  };

  const handleRaidSortFilterChange = async (sortOption: Option) => {
    setRaidSort(sortOption);
    if (
      sortOption.value === 'oldestComment' ||
      sortOption.value === 'recentComment'
    ) {
      setRaidStatusFilter(raidStatusOptions.find((x) => x.value === 'ACTIVE'));
      setRaidRolesFilter(raidRolesOptions.find((x) => x.value === 'ALL'));
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
        <Select
          name='raidStatus'
          label='Raid Status'
          defaultValue={raidStatusFilter}
          options={raidStatusOptions}
          localForm={localForm}
          onChange={handleRaidStatusFilterChange}
        />
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <Select
          name='raidRoles'
          label='Raid Roles'
          defaultValue={raidRolesFilter}
          options={raidRolesOptions}
          localForm={localForm}
          onChange={handleRaidRolesFilterChange}
        />
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <Select
          name='raidPortfolioStatus'
          label='Raid Portfolio'
          defaultValue={raidPortfolioStatusFilter}
          options={raidPortfolioStatusOptions}
          localForm={localForm}
          onChange={handleRaidPortfolioStatusChange}
        />
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <Select
          name='raidSort'
          label='Sort'
          defaultValue={raidSort}
          options={raidSortOptions}
          localForm={localForm}
          onChange={handleRaidSortFilterChange}
        />
      </Flex>
    </Flex>
  );

  const { data, error, fetchNextPage, hasNextPage } = useRaidList({
    token,
    raidStatusFilterKey: String(raidStatusFilter?.value),
    raidRolesFilterKey: String(raidRolesFilter?.value),
    raidSortKey: String(raidSort?.value),
    raidPortfolioStatusFilterKey: String(raidPortfolioStatusFilter?.value),
  });
  const { data: count } = useRaidsCount({
    token,
    raidStatusFilterKey: String(raidStatusFilter?.value),
    raidRolesFilterKey: String(raidRolesFilter?.value),
    raidSortKey: String(raidSort?.value),
    raidPortfolioStatusFilterKey: String(raidPortfolioStatusFilter?.value),
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
