import _ from 'lodash';
import { Heading, HStack, Flex, Box } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useRaidDetail from '../../hooks/useRaidDetail';
import RaidDetailsCard from '../../components/RaidDetailsCard';
import SiteLayout from '../../components/SiteLayout';
import { useSession } from 'next-auth/react';
import RaidDetailsSidebar from '../../components/RaidDetailsSidebar';

const Raid = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ token });

  return (
    <>
      <NextSeo title="Raid" />

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
          <Box w="60%">
            <RaidDetailsCard
              raid={raid}
              consultation={_.get(raid, 'consultation')}
            />
          </Box>

          <Box w="35%">
            <RaidDetailsSidebar raid={raid} />
          </Box>
        </HStack>
      </SiteLayout>
    </>
  );
};

export default Raid;
