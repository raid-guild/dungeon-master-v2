import _ from 'lodash';
import { Stack, Heading, Flex, Spinner } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useApplicationList from '../hooks/useApplicationList';
import MemberCard from '../components/MemberCard';
import { IApplication } from '../utils';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';

const ApplicationList = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data, error, hasNextPage, fetchNextPage } = useApplicationList({
    token,
  });
  const applications = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Applications" />

      <SiteLayout
        isLoading={!data}
        data={applications}
        subheader={<Heading>Application List</Heading>}
        error={error}
      >
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
      </SiteLayout>
    </>
  );
};

export default ApplicationList;
