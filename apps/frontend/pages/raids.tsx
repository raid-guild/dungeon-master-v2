import _ from 'lodash';
import { Stack, Heading, Spinner, Flex } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useDefaultTitle from '../hooks/useDefaultTitle';
import useRaidList from '../hooks/useRaidList';
import RaidCard from '../components/RaidCard';
import { IRaid } from '../utils';

const RaidList = () => {
  const title = useDefaultTitle();
  const { data, fetchNextPage, hasNextPage } = useRaidList();
  const raids = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Raids List" />

      <Stack spacing={8} align="center">
        <Heading>{title}</Heading>
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
          <Stack spacing={4} maxW="70%" mx="auto">
            {_.map(raids, (raid: IRaid) => (
              <RaidCard raid={raid} key={_.get(raid, 'id')} />
            ))}
          </Stack>
        </InfiniteScroll>
      </Stack>
    </>
  );
};

export default RaidList;
