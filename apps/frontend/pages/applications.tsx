import _ from 'lodash';
import { Stack, Heading, Flex, Spinner } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useApplicationList from '../hooks/useApplicationList';
import MemberCard from '../components/MemberCard';
import { IApplication } from '../utils';

const ApplicationList = () => {
  const { data, hasNextPage, fetchNextPage } = useApplicationList();
  const applications = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Applications" />

      <Stack spacing={8} align="center">
        <Heading>Application List</Heading>

        <InfiniteScroll
          pageStart={0}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Flex my={25} w="100%" justify="center">
              <Spinner size="xl" />
            </Flex>
          }
        >
          <Stack spacing={4}>
            {_.map(applications, (application: IApplication) => (
              <MemberCard application={application} />
            ))}
          </Stack>
        </InfiniteScroll>
      </Stack>
    </>
  );
};

export default ApplicationList;
