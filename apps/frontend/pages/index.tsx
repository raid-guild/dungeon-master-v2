import React from 'react';
import _ from 'lodash';
import { Flex, Heading, Stack } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';
import SiteLayout from '../components/SiteLayout';
import MiniRaidCard from '../components/MiniRaidCard';
import useDashboardList from '../hooks/useDashboardList';
import { IConsultation, IRaid } from '../types';

const Home: React.FC = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { address } = useAccount();
  const { data } = useDashboardList({ token, address });
  // console.log(data);

  return (
    <>
      <NextSeo title="Dashboard" />

      <SiteLayout isLoading={!data} subheader={<Heading>Dashboard</Heading>}>
        <Flex
          direction={['column', null, null, 'row']}
          alignItems="flex-start"
          justify="space-between"
          gap={8}
          w="100%"
        >
          <Stack w={['90%', null, null, '45%']} spacing={4}>
            <Heading size="lg">My Raids</Heading>
            {!_.isEmpty(_.get(data, 'myRaids.active')) && (
              <Stack spacing={4}>
                <Heading size="md">Active Raids</Heading>
                <Stack spacing={4}>
                  {_.map(_.get(data, 'myRaids.active'), (raid: IRaid) => (
                    <MiniRaidCard key={raid.id} raid={raid} />
                  ))}
                </Stack>
              </Stack>
            )}
            {!_.isEmpty(_.get(data, 'myRaids.past')) && (
              <Stack spacing={4}>
                <Heading size="md">Past Raids</Heading>
                <Stack spacing={4}>
                  {_.map(_.get(data, 'myRaids.past'), (raid: IRaid) => (
                    <MiniRaidCard key={raid.id} raid={raid} />
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
          <Stack w={['90%', null, null, '45%']} spacing={4}>
            <Heading>New Consultations</Heading>
            {_.map(
              _.get(data, 'newConsultations'),
              (consultation: IConsultation) => (
                <MiniRaidCard
                  key={consultation.id}
                  consultation={consultation}
                />
              )
            )}
            <Heading size="lg">New Raids</Heading>
            {_.map(_.get(data, 'newRaids'), (raid: IRaid) => (
              <MiniRaidCard key={raid.id} raid={raid} newRaid />
            ))}
          </Stack>
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Home;
