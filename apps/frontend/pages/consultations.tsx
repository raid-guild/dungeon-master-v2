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
import { useSession } from 'next-auth/react';
import InfiniteScroll from 'react-infinite-scroller';
import useConsultationList, {
  useConsultationsCount,
} from '../hooks/useConsultationList';
import useDefaultTitle from '../hooks/useDefaultTitle';
import RaidCard from '../components/RaidCard';
import { IConsultation } from '../utils';
import SiteLayout from '../components/SiteLayout';
import {
  BUDGET_DISPLAY_OPTIONS,
  SUBMISSION_TYPE_DISPLAY_OPTIONS,
} from '../utils';

const consultationTypeOptions = [
  { label: 'Show All', value: 'ALL' },
  { label: 'New', value: 'NEW' },
  { label: 'Existing', value: 'EXISTING' },
];

const consultationSubmissionOptions = [
  { label: 'Show All', value: 'ALL' },
  ...SUBMISSION_TYPE_DISPLAY_OPTIONS,
];

const consultationBudgetOptions = [
  { label: 'Show All', value: 'ALL' },
  ...BUDGET_DISPLAY_OPTIONS,
];

const consultationSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Recently Added', value: 'recentlyAdded' },
];

const ConsultationList = () => {
  const [consultationTypeFilter, setConsultationTypeFilter] =
    useState<string>('ALL');
  const [consultationBudgetFilter, setConsultationBudgetFilter] =
    useState<string>('ALL');
  const [consultationSubmissionFilter, setConsultationSubmissionFilter] =
    useState<string>('ALL');
  const [consultationSort, setConsultationSort] = useState<string>('name');
  const [sortChanged, setSortChanged] = useState(false);
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data, error, hasNextPage, fetchNextPage } = useConsultationList({
    token,
    consultationTypeFilterKey: consultationTypeFilter,
    consultationBudgetFilterKey: consultationBudgetFilter,
    consultationSubmissionFilterKey: consultationSubmissionFilter,
    consultationSortKey: consultationSort,
  });

  const { data: count } = useConsultationsCount({
    token,
    consultationTypeFilterKey: consultationTypeFilter,
    consultationBudgetFilterKey: consultationBudgetFilter,
    consultationSubmissionFilterKey: consultationSubmissionFilter,
  });

  const consultations = _.flatten(_.get(data, 'pages'));

  // TODO: generalize these and share code
  const handleConsultationTypeFilterChange = async (filterOption: string) => {
    setConsultationTypeFilter(filterOption);
  };

  const handleConsultationBudgetFilterChange = async (filterOption: string) => {
    setConsultationBudgetFilter(filterOption);
  };

  const handleConsultationSubmissionFilterChange = async (
    filterOption: string
  ) => {
    setConsultationSubmissionFilter(filterOption);
  };

  const handleConsultationSortChange = async (sortOption: string) => {
    setConsultationSort(sortOption);
    setSortChanged(true);
  };

  // TODO: generalize and move to separate file -- will need to pass options and filter state
  const ConsultationControls = () => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
      width={['90%', null, null, '100%']}
      gap={[2, 4, 4, 8]}
    >
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='consultationType'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Project Type
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='consultationType'
          value={consultationTypeFilter}
          defaultValue={consultationTypeOptions['Show All']}
          onChange={(e) => {
            handleConsultationTypeFilterChange(e.target.value);
          }}
        >
          {consultationTypeOptions.map((consultationType) => (
            <option key={consultationType.value} value={consultationType.value}>
              {consultationType.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
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
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='consultationSubmission'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Submission
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='consultationSubmission'
          id='consultationSubmission'
          value={consultationSubmissionFilter}
          defaultValue={consultationSubmissionOptions['Show All']}
          onChange={(e) => {
            handleConsultationSubmissionFilterChange(e.target.value);
          }}
        >
          {consultationSubmissionOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
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
      </Flex>
    </Flex>
  );

  return (
    <>
      <NextSeo title='Consultations' />

      <SiteLayout
        isLoading={!data}
        data={consultations}
        subheader={
          <>
            <Flex w='100%' align='center'>
              <Spacer />
              <Heading>{title} List</Heading>
              <Spacer />
              {count > 0 && (
                <Text fontSize='3xl' fontWeight={800}>
                  {count}
                </Text>
              )}
            </Flex>
            <ConsultationControls />
          </>
        }
        emptyDataPhrase='No consultations found'
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
          <Stack spacing={4} mx='auto'>
            {_.map(consultations, (consultation: IConsultation) => (
              <RaidCard
                consultation={consultation}
                key={_.get(consultation, 'id')}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default ConsultationList;
