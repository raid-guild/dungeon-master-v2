import React from 'react';
import _ from 'lodash';
import { Flex, Heading, Stack } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';
import SiteLayout from '../components/SiteLayout';
import MiniRaidCard from '../components/MiniRaidCard';
import useDashboardList from '../hooks/useDashboardList';

const Home: React.FC = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { address } = useAccount();
  const { data } = useDashboardList({ token, address });
  console.log(data);

  return (
    <>
      <NextSeo title="Dashboard" />

      <SiteLayout isLoading={!data} subheader={<Heading>Dashboard</Heading>}>
        <Flex alignItems="center" justify="space-between" gap={8} w="100%">
          <Stack w="45%" spacing={4}>
            <Heading size="lg">My Raids</Heading>
            {_.map(_.get(data, 'myRaids'), (raid) => (
              <MiniRaidCard key={raid.id} raid={raid} />
            ))}
          </Stack>
          <Stack w="45%" spacing={4}>
            <Heading size="lg">New Raids</Heading>
            {_.map(_.get(data, 'newRaids'), (raid) => (
              <MiniRaidCard key={raid.id} raid={raid} newRaid />
            ))}
          </Stack>
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Home;
