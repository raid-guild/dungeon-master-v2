import {
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@raidguild/design-system';
import { useDashboardList } from '@raidguild/dm-hooks';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import React from 'react';
import { useAccount } from 'wagmi';

import MiniRaidCard from '../components/MiniRaidCard';
import SiteLayout from '../components/SiteLayout';

const Home = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const role = _.get(session, 'user.role');

  const router = useRouter();
  const { address } = useAccount();
  const { data } = useDashboardList({ token, role, address });

  const userRaids =
    !_.isEmpty(_.get(data, 'myRaids.active')) ||
    !_.isEmpty(_.get(data, 'myRaids.past'));

  if (role === 'user') {
    router.push('/escrow');
  }

  return (
    <>
      <NextSeo title='Dashboard' />

      <SiteLayout isLoading={!data}>
        <Flex
          direction={['column', null, null, 'row']}
          alignItems='flex-start'
          justify='space-between'
          gap={8}
          w='100%'
        >
          {userRaids && (
            <Stack spacing={6} w={['90%', null, null, '45%']}>
              <Heading size='lg'>My Raids</Heading>
              <Tabs>
                <TabList>
                  {!_.isEmpty(_.get(data, 'myRaids.active')) && (
                    <Tab>
                      <Text fontSize='xl'>Active Raids</Text>
                    </Tab>
                  )}
                  {!_.isEmpty(_.get(data, 'myRaids.past')) && (
                    <Tab>
                      <Text fontSize='xl'>Past Raids</Text>
                    </Tab>
                  )}
                </TabList>

                <TabPanels>
                  {!_.isEmpty(_.get(data, 'myRaids.active')) && (
                    <TabPanel>
                      <Stack spacing={4}>
                        <Stack spacing={4}>
                          {_.map(
                            _.get(data, 'myRaids.active'),
                            (raid: IRaid) => (
                              <MiniRaidCard key={raid.id} raid={raid} />
                            )
                          )}
                        </Stack>
                      </Stack>
                    </TabPanel>
                  )}
                  {!_.isEmpty(_.get(data, 'myRaids.past')) && (
                    <TabPanel>
                      <Stack spacing={4}>
                        {_.map(_.get(data, 'myRaids.past'), (raid: IRaid) => (
                          <MiniRaidCard key={raid.id} raid={raid} />
                        ))}
                      </Stack>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </Stack>
          )}

          <Stack w={['90%', null, null, userRaids ? '45%' : '80%']} spacing={6}>
            <Heading size='lg'>Incoming</Heading>
            <Tabs>
              <TabList>
                <Tab>
                  <Text fontSize='xl'>Pending Consultations</Text>
                </Tab>
                <Tab>
                  <Text fontSize='xl'>Recent Raids</Text>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    {!_.isEmpty(_.get(data, 'newConsultations')) ? (
                      _.map(
                        _.get(data, 'newConsultations'),
                        (consultation: IConsultation) => (
                          <MiniRaidCard
                            key={consultation.id}
                            consultation={consultation}
                            newRaid
                          />
                        )
                      )
                    ) : (
                      <Flex justify='center'>
                        <Text fontSize='xl' my={10}>
                          No pending consultations
                        </Text>
                      </Flex>
                    )}
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={4}>
                    {_.map(_.get(data, 'newRaids'), (raid: IRaid) => (
                      <MiniRaidCard key={raid.id} raid={raid} newRaid />
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Home;
