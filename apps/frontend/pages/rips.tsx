/* eslint-disable dot-notation */
/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';
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
  Button,
  HStack,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import { useRaidList, useRaidsCount } from '@raidguild/dm-hooks';
import { IRaid, RIP_STATUS, GUILD_CLASS_OPTIONS } from '@raidguild/dm-utils';
import { IRip, raidSortKeys } from '@raidguild/dm-types';
import RipCard from '../components/RipCard';
import SiteLayout from '../components/SiteLayout';
import axios from 'axios';

const getRipDetail = async () => {
  try {
    const { data } = await axios.post('/api/rip-detail-query', {});

    const ripList = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

    const activeRipList = ripList.filter((rip) => {
      return ['Consideration', 'Submitted', 'In Progress'].includes(
        rip.ripCategory
      );
    });

    return activeRipList;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch RIP details');
  }
};

const ripStatusMapped = RIP_STATUS.map((status) => ({
  label: status,
  value: status.toUpperCase(),
}));

const raidStatusOptions = [
  ...[{ label: 'Active', value: 'ACTIVE' }],
  ...[{ label: 'Show All', value: 'ALL' }],
  ...ripStatusMapped,
];

const raidRolesOptions = [
  ...[{ label: 'Show All', value: 'ALL' }],
  ...[{ label: 'Any Role Set', value: 'ANY_ROLE_SET' }],
  ...GUILD_CLASS_OPTIONS,
];

const raidSortOptions = [
  { label: 'Oldest Comment', value: 'oldestComment' },
  { label: 'Recent Comment', value: 'recentComment' },
  { label: 'Name', value: 'name' },
  { label: 'Create Date', value: 'createDate' },
  // { label: 'Start Date', value: 'startDate' },
  // { label: 'End Date', value: 'endDate' },
  // { label: 'Recently Updated', value: 'recentlyUpdated' },
];

const RaidList = () => {
  const [raidStatusFilter, setRaidStatusFilter] = useState<string>('ACTIVE');
  const [raidSort, setRaidSort] = useState<raidSortKeys>('oldestComment');
  const [raidRolesFilter, setRaidRolesFilter] = useState<string>('ALL');
  const [sortChanged, setSortChanged] = useState(false);
  const title = 'RIPs';
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const handleRaidStatusFilterChange = async (status: string) => {
    setRaidStatusFilter(status);
  };

  // const handleRaidRolesFilterChange = async (role: string) => {
  //   setRaidRolesFilter(role);
  // };

  const handleRaidSortChange = async (sortOption: raidSortKeys) => {
    setRaidSort(sortOption);
    // setSortChanged(true);
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
          RIP Status
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
      {/* <Flex direction='column' flexBasis='25%'>
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
      </Flex> */}
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

  const [rips, setRips] = useState([]);
  useEffect(() => {
    getRipDetail().then((data) => {
      setRips(data);
    });
  }, []);

  return (
    <>
      <NextSeo title='RIPs List' />

      <SiteLayout
        isLoading={!data}
        data={rips}
        emptyDataPhrase='No RIPs Found!'
        subheader={
          <>
            <Flex w='100%' align='center'>
              <Spacer />
              <Heading>{title}</Heading>
              <Spacer />
              {count > 0 && (
                <HStack alignItems={'baseline'} gap={1}>
                  <Text fontSize='3xl' fontWeight={800}>
                    {count}
                  </Text>
                  <Text fontSize='sm' fontWeight={'normal'}>
                    proposal{count > 1 ? 's' : ''}
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
            {_.map(rips, (rip: IRip) => (
              <RipCard rip={rip} key={_.get(rip, 'number')} />
            ))}
          </Stack>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default RaidList;
