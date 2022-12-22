import _ from 'lodash';
import { Heading, Flex, Stack, Box } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import useRaidDetail from '../../hooks/useRaidDetail';
import RaidDetailsCard from '../../components/RaidDetailsCard';
import SiteLayout from '../../components/SiteLayout';
import { useSession } from 'next-auth/react';
import RaidDetailsSidebar from '../../components/RaidDetailsSidebar';
import RaidUpdatesFeed from '../../components/RaidUpdatesFeed';

const Raid = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const token = _.get(session, 'token');
  const raidId = _.get(router, 'query.raid');
  const { data: raid, isLoading } = useRaidDetail({ raidId, token });
  console.log(isLoading, raid);

  return (
    <>
      <NextSeo title={_.get(raid, 'name')} />

      <SiteLayout
        subheader={<Heading size="lg">{_.get(raid, 'name')}</Heading>}
        isLoading={!raid}
        data={raid}
      >
        <Flex
          w="95%"
          minW={['350px', null, null, '1200px']}
          mx="auto"
          direction={['column', null, null, 'row']}
          gap={10}
          align="flex-start"
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

export default Raid;
