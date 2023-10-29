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
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import { useRipList, useRipsCount } from '@raidguild/dm-hooks';
import { RIP_STATUS } from '@raidguild/dm-utils';
import { IRip, ripSortKeys } from '@raidguild/dm-types';
import RipCard from '../components/RipCard';
import SiteLayout from '../components/SiteLayout';

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
  { label: 'Status', value: 'status' },
  { label: 'Oldest Comment', value: 'oldestComment' },
  { label: 'Recent Comment', value: 'recentComment' },
  { label: 'Name', value: 'name' },
  { label: 'Created Date', value: 'createdDate' },
];

const RipList = () => {
  const title = 'RIPs';
  const [ripStatusFilterKey, setRipStatusFilterKey] =
    useState<string>('ACTIVE');
  const [ripSortKey, setRipSortKey] = useState<ripSortKeys>('status');
  const {
    data: rips,
    error,
    isLoading,
  } = useRipList({ ripStatusFilterKey, ripSortKey });
  const { data: ripCount } = useRipsCount({ ripStatusFilterKey, ripSortKey });

  const handleRipStatusFilterChange = async (status: string) => {
    setRipStatusFilterKey(status);
  };

  const handleRipSortChange = async (sortOption: ripSortKeys) => {
    setRipSortKey(sortOption);
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
          value={ripStatusFilterKey}
          onChange={(e) => {
            handleRipStatusFilterChange(e.target.value);
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
          htmlFor='ripSortKey'
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
          name='ripSortKey'
          value={ripSortKey}
          onChange={(e) => {
            handleRipSortChange(e.target.value as ripSortKeys);
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
            <RipControls />
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