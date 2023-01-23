import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  Heading,
  Flex,
  FormLabel,
  ChakraSelect,
  Spinner,
  Spacer,
  Text,
} from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useApplicationList from '../hooks/useApplicationList';
import MemberCard from '../components/MemberCard';
import useDefaultTitle from '../hooks/useDefaultTitle';
import { IApplication } from '../utils';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';
import { APPLICATION_SKILL_TYPE_DISPLAY_OPTIONS } from '../utils/constants';

const applicationSkillTypeOptions = [
  { label: 'Show All', value: 'ALL' },
  ...APPLICATION_SKILL_TYPE_DISPLAY_OPTIONS,
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
      {/* <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='consultationBudget'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Budget
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='consultationBudget'
          id='consultationBudget'
          value={consultationBudgetFilter}
          defaultValue={consultationBudgetOptions['Show All']}
          onChange={(e) => {
            handleConsultationBudgetFilterChange(e.target.value);
          }}
        >
          {consultationBudgetOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex> */}
      {/* <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='consultationSort'
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
          name='consultationSort'
          value={consultationSort}
          defaultValue={consultationSort['Name']}
          onChange={(e) => {
            handleConsultationSortChange(e.target.value);
          }}
        >
          {consultationSortOptions.map((sortOption) => (
            <option key={sortOption.value} value={sortOption.value}>
              {sortOption.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex> */}
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
              <Spacer />
              <Heading>{title} List</Heading>
              <Spacer />
              {/* {count > 0 && (
                <Text fontSize='3xl' fontWeight={800}>
                  {count}
                </Text>
              )} */}
            </Flex>
            <ApplicationControls />
          </>
        }
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
          <Stack spacing={4}>
            {_.map(applications, (application: IApplication) => (
              <MemberCard application={application} />
            ))}
          </Stack>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default ApplicationList;
