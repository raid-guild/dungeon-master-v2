import _ from 'lodash';
import { Heading, HStack, Stack, Box } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useRaidDetail from '../../hooks/useRaidDetail';
import RaidDetailsCard from '../../components/RaidDetailsCard';
import SiteLayout from '../../components/SiteLayout';
import { useSession } from 'next-auth/react';
import RaidDetailsSidebar from '../../components/RaidDetailsSidebar';
import RaidUpdatesFeed from '../../components/RaidUpdatesFeed';

const Raid = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ token });
  console.log(raid);

  return (
    <>
      <NextSeo title={_.get(raid, 'name')} />

      <SiteLayout
        subheader={<Heading>{_.get(raid, 'name')}</Heading>}
        isLoading={!raid}
        data={raid}
      >
        <HStack
          w="90%"
          minW={['1200px']}
          mx="auto"
          spacing={10}
          align="flex-start"
        >
          <Stack w="60%" spacing={8}>
            <RaidDetailsCard
              raid={raid}
              consultation={_.get(raid, 'consultation')}
            />
            <RaidUpdatesFeed raid={raid} />
          </Stack>

          <Box w="35%">
            <RaidDetailsSidebar raid={raid} />
          </Box>
        </HStack>
      </SiteLayout>
    </>
  );
};

export default Raid;
