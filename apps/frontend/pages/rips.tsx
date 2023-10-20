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
  HStack,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import { useRaidList, useRaidsCount } from '@raidguild/dm-hooks';
import { IRaid, RIP_STATUS, GUILD_CLASS_OPTIONS } from '@raidguild/dm-utils';
import { IRip, ripSortKeys } from '@raidguild/dm-types';
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

const ripStatusOptions = [
  ...[{ label: 'Active', value: 'ACTIVE' }],
  ...[{ label: 'Show All', value: 'ALL' }],
  ...ripStatusMapped,
];

// const raidRolesOptions = [
//   ...[{ label: 'Show All', value: 'ALL' }],
//   ...[{ label: 'Any Role Set', value: 'ANY_ROLE_SET' }],
//   ...GUILD_CLASS_OPTIONS,
// ];

const ripSortOptions = [
  { label: 'Oldest Comment', value: 'oldestComment' },
  { label: 'Recent Comment', value: 'recentComment' },
  { label: 'Name', value: 'name' },
  { label: 'Create Date', value: 'createDate' },
  // { label: 'Start Date', value: 'startDate' },
  // { label: 'End Date', value: 'endDate' },
  // { label: 'Recently Updated', value: 'recentlyUpdated' },
];

const RipList = () => {
  const [ripStatusFilter, setRipStatusFilter] = useState<string>('ACTIVE');
  const [ripSort, setRipSort] = useState<ripSortKeys>('oldestComment');
  const [raidRolesFilter, setRaidRolesFilter] = useState<string>('ALL');
  const [sortChanged, setSortChanged] = useState(false);
  const title = 'RIPs';
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const handleRipStatusFilterChange = async (status: string) => {
    setRipStatusFilter(status);
  };

  const handleRipSortChange = async (sortOption: ripSortKeys) => {
    setRipSort(sortOption);
    // setSortChanged(true);
    if (sortOption === 'oldestComment') {
      setRipStatusFilter('ACTIVE');
    }
  };

  // TODO: generalize and move to separate file -- will need to pass options and filter state
  const RipControls = () => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
      width={['90%', null, null, '100%']}
      gap={[2, 4, 4, 8]}
    >
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='ripStatus'
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
          name='ripStatus'
          value={ripStatusFilter}
          defaultValue='Active'
          onChange={(e) => {
            handleRipStatusFilterChange(e.target.value);
            if (ripSort === 'oldestComment') {
              handleRipStatusFilterChange('ACTIVE');
            }
          }}
        >
          {ripStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='ripSort'
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
          name='ripSort'
          value={ripSort}
          defaultValue='Name'
          onChange={(e) => {
            handleRipSortChange(e.target.value as ripSortKeys);
            if (e.target.value === 'oldestComment') {
              handleRipStatusFilterChange('ACTIVE');
            }
          }}
        >
          {ripSortOptions.map((sortOption) => (
            <option key={sortOption.value} value={sortOption.value}>
              {sortOption.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
    </Flex>
  );

  const {
    data: raidListData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useRaidList({
    token,
    raidStatusFilterKey: ripStatusFilter,
    raidRolesFilterKey: raidRolesFilter,
    raidSortKey: ripSort,
  });
  const { data: raidCount } = useRaidsCount({
    token,
    raidStatusFilterKey: ripStatusFilter,
    raidRolesFilterKey: raidRolesFilter,
    raidSortKey: ripSort,
  });

  // const raids = _.flatten(_.get(data, 'pages'));

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
        isLoading={!raidListData}
        data={rips}
        emptyDataPhrase='No RIPs Found!'
        subheader={
          <>
            <Flex w='100%' align='center'>
              <Spacer />
              <Heading>{title}</Heading>
              <Spacer />
              {raidCount > 0 && (
                <HStack alignItems={'baseline'} gap={1}>
                  <Text fontSize='3xl' fontWeight={800}>
                    {raidCount}
                  </Text>
                  <Text fontSize='sm' fontWeight={'normal'}>
                    proposal{raidCount > 1 ? 's' : ''}
                  </Text>
                </HStack>
              )}
            </Flex>
            <RipControls />
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

export default RipList;
