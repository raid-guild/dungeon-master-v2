import { Box, Flex, Heading, Stack, Text } from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { displayDate } from '@raidguild/dm-utils';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';

import RaidDetailsCard from '../../components/RaidDetailsCard';
import RaidDetailsSidebar from '../../components/RaidDetailsSidebar';
import RaidUpdatesFeed from '../../components/RaidUpdatesFeed';
import SiteLayout from '../../components/SiteLayout';

const RaidDate = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  if (endDate) {
    return (
      <Stack spacing={1}>
        <Heading size='sm'>Raid Ended</Heading>
        <Text>{displayDate(endDate)}</Text>
      </Stack>
    );
  }
  if (startDate) {
    return (
      <Stack spacing={1}>
        <Heading size='sm'>Raid Started</Heading>
        <Text>{displayDate(startDate)}</Text>
      </Stack>
    );
  }
  return null;
};

const Raid = ({ raidId }: { raidId: string }) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({
    raidId,
    token,
    roles: _.get(session, 'user.roles'),
  });

  const startOrEnd = _.get(raid, 'startDate') || _.get(raid, 'endDate');

  return (
    <>
      <NextSeo title={_.get(raid, 'name')} />

      <SiteLayout
        subheader={
          <Flex
            w='100%'
            justify={startOrEnd ? 'space-between' : 'center'}
            align='center'
          >
            {startOrEnd && <Box w='15%' />}

            <Heading size='lg'>{_.get(raid, 'name')}</Heading>

            <RaidDate
              startDate={_.get(raid, 'startDate')}
              endDate={_.get(raid, 'endDate')}
            />
          </Flex>
        }
        isLoading={!raid}
        data={raid}
      >
        <Flex
          w='95%'
          minW={['350px', null, null, '1000px']}
          mx='auto'
          direction={['column', null, null, 'row']}
          gap={10}
          align='flex-start'
        >
          <Stack w={['100%', null, null, '60%']} spacing={8}>
            <RaidDetailsCard
              raid={raid}
              consultation={_.get(raid, 'consultation')}
            />
            <RaidUpdatesFeed raid={raid} />
          </Stack>

          <Box w={['100%', null, null, '35%']}>
            <RaidDetailsSidebar raid={raid} />
          </Box>
        </Flex>
      </SiteLayout>
    </>
  );
};

// * use SSR to fetch query params for RQ invalidation
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { raid } = context.params;

  return {
    props: {
      raidId: raid || null,
    },
  };
};

export default Raid;
