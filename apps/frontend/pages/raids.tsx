import _ from 'lodash';
import { Stack, Heading, Spinner, Flex } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useDefaultTitle from '../hooks/useDefaultTitle';
import useRaidList from '../hooks/useRaidList';
import RaidCard from '../components/RaidCard';
import { IRaid } from '../utils';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';

const RaidList = () => {
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data, error, fetchNextPage, hasNextPage } = useRaidList({ token });
  const raids = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Raids List" />

      <SiteLayout
        isLoading={!data}
        data={raids}
        subheader={<Heading>{title}</Heading>}
        error={error}
      >
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Flex my={25} w="100%" justify="center" key={1}>
              <Spinner size="xl" my={50} />
            </Flex>
          }
        >
          <Stack spacing={4} mx="auto" key={2}>
            {_.map(raids, (raid: IRaid) => (
              <RaidCard
                raid={raid}
                consultation={_.get(raid, 'consultationByConsultation')}
                key={_.get(raid, 'id')}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default RaidList;
