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
import { useRipList, useRipsCount } from '@raidguild/dm-hooks';
import { RIP_STATUS } from '@raidguild/dm-utils';
import { IRip, ripSortKeys } from '@raidguild/dm-types';
import RipCard from '../components/RipCard';
import SiteLayout from '../components/SiteLayout';
import axios from 'axios';

const ripStatusMapped = RIP_STATUS.map((status) => ({
  label: status,
  value: status.toUpperCase(),
}));

const ripStatusOptions = [
  ...[{ label: 'Active', value: 'ACTIVE' }],
  ...[{ label: 'Show All', value: 'ALL' }],
  ...ripStatusMapped,
];

const ripSortOptions = [
  { label: 'Oldest Comment', value: 'oldestComment' },
  { label: 'Recent Comment', value: 'recentComment' },
  { label: 'Name', value: 'name' },
  { label: 'Create Date', value: 'createDate' },
  { label: 'Start Date', value: 'startDate' },
  { label: 'End Date', value: 'endDate' },
  { label: 'Recently Updated', value: 'recentlyUpdated' },
];

const RipList = () => {
  const [ripStatusFilter, setRipStatusFilter] = useState<string>('ACTIVE');
  const [ripSort, setRipSort] = useState<ripSortKeys>('oldestComment');
  const [raidRolesFilter, setRaidRolesFilter] = useState<string>('ALL');
  const [sortChanged, setSortChanged] = useState(false);
  const title = 'RIPs';
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: rips, error, isLoading } = useRipList();
  const { data: ripCount } = useRipsCount();

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

  return (
    <>
      <NextSeo title='RIPs List' />

      <SiteLayout
        isLoading={isLoading}
        data={rips}
        emptyDataPhrase='No RIPs found.'
        subheader={
          <>
            <Flex w='100%' align='center'>
              <Heading>{title}</Heading>
              <Spacer />
              {ripCount > 0 && (
                <HStack alignItems={'baseline'} gap={1}>
                  <Text fontSize='3xl' fontWeight={800}>
                    {ripCount}
                  </Text>
                  <Text fontSize='sm' fontWeight={'normal'}>
                    proposal{ripCount > 1 ? 's' : ''}
                  </Text>
                </HStack>
              )}
            </Flex>
            {/* <RipControls /> */}
          </>
        }
        error={error}
      >
        <InfiniteScroll
          pageStart={0}
          style={{ width: '100%' }}
          // loadMore={fetchNextPage}
          // hasMore={hasNextPage}
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
