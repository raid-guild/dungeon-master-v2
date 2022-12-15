import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  Heading,
  Spinner,
  Flex,

  // Select
} from '@raidguild/design-system';
import { Select as ChakraSelect } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useDefaultTitle from '../hooks/useDefaultTitle';
import useRaidList from '../hooks/useRaidList';
import RaidCard from '../components/RaidCard';
import { IRaid } from '../utils';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';
import { RAID_STATUS, GUILD_CLASS_OPTIONS } from '../utils';

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

console.log('RAID ROLES OPTIONS', raidRolesOptions);

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
  const [raidSort, setRaidSort] = useState<string>('oldestComment');
  const [raidRolesFilter, setRaidRolesFilter] = useState<string>('ALL');
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const handleRaidStatusFilterChange = async (status: string) => {
    setRaidStatusFilter(status);
  };

  const handleRaidRolesFilterChange = async (role: string) => {
    setRaidRolesFilter(role);
  };

  const handleRaidSortChange = async (sortOption: string) => {
    setRaidSort(sortOption);
    setRaidStatusFilter('ACTIVE');
  };

  const { data, error, fetchNextPage, hasNextPage } = useRaidList({
    token,
    raidStatusFilterKey: raidStatusFilter,
    raidSortKey: raidSort,
    raidRolesFilterKey: raidRolesFilter,
  });

  const raids = _.flatten(_.get(data, 'pages'));
  console.log('raids', raids);

  return (
    <>
      <NextSeo title="Raids List" />

      <SiteLayout
        isLoading={!data}
        data={raids}
        subheader={<Heading>{title}</Heading>}
        error={error}
      >
        <Flex
          direction="row"
          justifyContent="space-between"
          width="100%"
          gap={8}
        >
          <ChakraSelect
            flexBasis="25%"
            name="raidStatus"
            value={raidStatusFilter}
            defaultValue={raidStatusOptions['Active']}
            onChange={(e) => {
              console.log('e', e.target.value);
              handleRaidStatusFilterChange(e.target.value);
            }}
          >
            {raidStatusOptions.map((status) => (
              <option key={status.value}>{status.value}</option>
            ))}
          </ChakraSelect>
          <ChakraSelect
            flexBasis="25%"
            name="raidRoles"
            value={raidRolesFilter}
            defaultValue={raidRolesOptions['Show All']}
            onChange={(e) => {
              console.log('e', e.target.value);
              handleRaidRolesFilterChange(e.target.value);
            }}
          >
            {raidRolesOptions.map((role) => (
              <option key={role.value}>{role.value}</option>
            ))}
          </ChakraSelect>
          <ChakraSelect
            flexBasis="25%"
            name="raidSort"
            value={raidSort}
            defaultValue={raidSortOptions['Oldest Comment']}
            onChange={(e) => {
              console.log('sort', e.target.value);
              handleRaidSortChange(e.target.value);
            }}
          >
            {raidSortOptions.map((sortOption) => (
              <option key={sortOption.value}>{sortOption.value}</option>
            ))}
          </ChakraSelect>
        </Flex>
        {raids && raids.length > 0 ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <Flex my={25} w="100%" justify="center" key={1}>
                <Spinner size="xl" my={50} />
              </Flex>
            }
          >
            <Stack spacing={4} mx="auto" key={2}>
              {_.map(raids, (raid: IRaid) => (
                <RaidCard
                  raid={raid}
                  consultation={_.get(raid, 'consultation')}
                  key={_.get(raid, 'id')}
                />
              ))}
            </Stack>
          </InfiniteScroll>
        ) : (
          <Flex justify="center" align="center" minH="50vh">
            <Heading size="md">No projects found!</Heading>
          </Flex>
        )}
      </SiteLayout>
    </>
  );
};

export default RaidList;
