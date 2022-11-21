import _ from 'lodash';
import { Stack, Heading, Flex, Spinner } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useConsultationList from '../hooks/useConsultationList';
import useDefaultTitle from '../hooks/useDefaultTitle';
import RaidCard from '../components/RaidCard';
import { IConsultation } from '../utils';

const ConsultationList = () => {
  const title = useDefaultTitle();
  const { data, hasNextPage, fetchNextPage } = useConsultationList();
  const consultations = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Consultations" />

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
          <Stack spacing={4} maxW="70%" mx="auto">
            {_.map(consultations, (consultation: IConsultation) => (
              <RaidCard
                consultation={consultation}
                key={_.get(consultation, 'id')}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </Stack>
    </>
  );
};

export default ConsultationList;
