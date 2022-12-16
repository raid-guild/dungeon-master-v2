import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  Heading,
  Spinner,
  Flex,
  FormLabel,
  Text,

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
  const [raidSort, setRaidSort] = useState<string>('name');
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

  const handleRaidSortChange = async (sortOption: string) => {
    setRaidSort(sortOption);
    setSortChanged(true);
    if (sortOption === 'oldestComment') {
      setRaidStatusFilter('ACTIVE');
    }
  };

  const { data, error, fetchNextPage, hasNextPage } = useRaidList({
    token,
    raidStatusFilterKey: raidStatusFilter,
    raidSortKey: raidSort,
    raidRolesFilterKey: raidRolesFilter,
  });

  const raids = _.flatten(_.get(data, 'pages'));

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
          <Flex direction="column" flexBasis="25%">
            <FormLabel
              htmlFor="raidStatus"
              maxWidth="720px"
              fontFamily="texturina"
              lineHeight="1.8"
              color={['black', 'white']}
              textAlign="left"
            >
              Raid Status
            </FormLabel>
            <ChakraSelect
              width="100%"
              name="raidStatus"
              value={raidStatusFilter}
              defaultValue={raidStatusOptions['Active']}
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
          <Flex direction="column" flexBasis="25%">
            <FormLabel
              htmlFor="raidRoles"
              maxWidth="720px"
              fontFamily="texturina"
              lineHeight="1.8"
              color={['black', 'white']}
              textAlign="left"
            >
              Raid Roles
            </FormLabel>
            <ChakraSelect
              width="100%"
              name="raidRoles"
              id="raidRoles"
              value={raidRolesFilter}
              defaultValue={raidRolesOptions['Show All']}
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
          <Flex direction="column" flexBasis="25%">
            <FormLabel
              htmlFor="raidSort"
              maxWidth="720px"
              fontFamily="texturina"
              lineHeight="1.8"
              color={['black', 'white']}
              textAlign="left"
            >
              Sort
            </FormLabel>
            <ChakraSelect
              width="100%"
              name="raidSort"
              value={raidSort}
              defaultValue={raidSortOptions['Name']}
              onChange={(e) => {
                handleRaidSortChange(e.target.value);
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
