/* eslint-disable dot-notation */
/* eslint-disable react/no-unstable-nested-components */

import { useState } from 'react';
import _ from 'lodash';
import {
  Heading,
  Flex,
  FormLabel,
  ChakraSelect,
  Spinner,
  Spacer,
  SimpleGrid,
  Text,
  HStack,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import {
  useApplicationsCount,
  useApplicationList,
  useDefaultTitle,
} from '@raidguild/dm-hooks';
import {
  IApplication,
  APPLICATION_SKILL_TYPE_DISPLAY_OPTIONS,
  SKILLS_DISPLAY_OPTIONS,
} from '@raidguild/dm-utils';
import MemberCard from '../components/MemberCard';
import SiteLayout from '../components/SiteLayout';

const applicationSkillTypeOptions = [
  { label: 'Show All', value: 'ALL' },
  ...APPLICATION_SKILL_TYPE_DISPLAY_OPTIONS,
];

const applicationSkillOptions = [
  { label: 'Show All', value: 'ALL' },
  ...SKILLS_DISPLAY_OPTIONS,
];

const applicationSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Created', value: 'createdAt' },
];

const ApplicationList = () => {
  const [applicationSkillTypeFilter, setApplicationSkillTypeFilter] =
    useState<string>('ALL');
  const [applicationSkillFilter, setApplicationSkillFilter] =
    useState<string>('ALL');
  const [applicationSort, setApplicationSort] = useState<string>('name');
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data, error, hasNextPage, fetchNextPage } = useApplicationList({
    token,
    applicationSkillTypeFilterKey: applicationSkillTypeFilter,
    applicationSkillFilterKey: applicationSkillFilter,
    applicationSortKey: applicationSort,
  });

  const { data: count } = useApplicationsCount({
    token,
    applicationSkillTypeFilterKey: applicationSkillTypeFilter,
    applicationSkillFilterKey: applicationSkillFilter,
  });

  const applications = _.flatten(_.get(data, 'pages'));

  // TODO: generalize these and share code
  const handleApplicationSkillTypeFilterChange = async (
    filterOption: string
  ) => {
    setApplicationSkillTypeFilter(filterOption);
  };

  const handleApplicationSkillFilterChange = async (filterOption: string) => {
    setApplicationSkillFilter(filterOption);
  };

  const handleApplicationSortChange = async (sortOption: string) => {
    setApplicationSort(sortOption);
  };

  // TODO: generalize and move to separate file -- will need to pass options and filter state
  const ApplicationControls = () => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
      width={['90%', null, null, '100%']}
      gap={[4, null, null, 8]}
      paddingX={6}
    >
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='applicationSkillType'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Skill Type
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='applicationSkillType'
          value={applicationSkillTypeFilter}
          defaultValue={applicationSkillTypeOptions['Show All']}
          onChange={(e) => {
            handleApplicationSkillTypeFilterChange(e.target.value);
          }}
        >
          {applicationSkillTypeOptions.map((applicationSkillType) => (
            <option
              key={applicationSkillType.value}
              value={applicationSkillType.value}
            >
              {applicationSkillType.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='applicationSkill'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Skill
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='applicationSkill'
          value={applicationSkillFilter}
          defaultValue={applicationSkillOptions['Show All']}
          onChange={(e) => {
            handleApplicationSkillFilterChange(e.target.value);
          }}
        >
          {applicationSkillOptions.map((applicationSkill) => (
            <option key={applicationSkill.value} value={applicationSkill.value}>
              {applicationSkill.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='applicationSort'
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
          name='applicationSort'
          value={applicationSort}
          defaultValue={applicationSort['Name']}
          onChange={(e) => {
            handleApplicationSortChange(e.target.value);
          }}
        >
          {applicationSortOptions.map((sortOption) => (
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
      <NextSeo title='Applications' />

      <SiteLayout
        isLoading={!data}
        data={applications}
        subheader={
          <>
            <Flex w='100%' align='center'>
              <Heading variant='noShadow'>{title} List</Heading>
              <Spacer />
              {count > 0 && (
                <HStack alignItems={'baseline'} gap={1}>
                  <Text fontSize='3xl' fontWeight={800}>
                    {count}
                  </Text>
                  <Text fontSize='sm' fontWeight={'normal'}>
                    application{count > 1 ? 's' : ''}
                  </Text>
                </HStack>
              )}
            </Flex>
            <ApplicationControls />
          </>
        }
        emptyDataPhrase='No applications found'
        error={error}
      >
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Flex my={25} w='100%' justify='center'>
              <Spinner size='xl' />
            </Flex>
          }
        >
          <SimpleGrid gap={4} columns={[1, null, null, 2]}>
            {_.map(applications, (application: IApplication) => (
              <MemberCard application={application} key={application.id} />
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default ApplicationList;
