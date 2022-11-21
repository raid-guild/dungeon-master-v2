import _ from 'lodash';
import { Stack, Heading, Flex, Spinner } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useMemberList from '../hooks/useMemberList';
import useDefaultTitle from '../hooks/useDefaultTitle';
import MemberCard from '../components/MemberCard';

const MemberList = () => {
  const title = useDefaultTitle();
  const { data, fetchNextPage, hasNextPage } = useMemberList();
  const members = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Members List" />

      <Stack spacing={8} align="center">
        <Heading>{title} List</Heading>

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
            {_.map(members, (member) => (
              <MemberCard
                member={member}
                application={_.get(member, 'applicationByApplication')}
                key={_.get(member, 'id')}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </Stack>
    </>
  );
};

export default MemberList;
