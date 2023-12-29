import {
  Card,
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
import { useDashboardList, useMemberDetail } from '@raidguild/dm-hooks';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useAccount } from 'wagmi';

import DashboardRaidCard from '../components/DashboardRaidCard';
import MemberDetailsCard from '../components/MemberDetailsCard';
import MiniRaidCard from '../components/MiniRaidCard';
import SiteLayout from '../components/SiteLayout';

const Home = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const role = _.get(session, 'user.role');
  const { address: memberAddress } = useAccount();
  const router = useRouter();
  const { data: memberData } = useMemberDetail({ memberAddress, token });

  const member = memberData?.member;

  const { data } = useDashboardList({ token, role, address: memberAddress });

  if (role === 'user') {
    router.push('/escrow');
  }

  return (
    <>
      <NextSeo title='Dashboard' />

      <SiteLayout isLoading={!data}>
        <Stack
          gap={10}
          maxW='1440px'
          w='100%'
          alignItems='center'
          justifyContent='center'
        >
          <Flex
            direction={['column', null, null, 'row']}
            justify='space-between'
            w='100%'
            gap={4}
          >
            <Card variant='filled' w='full' h='650px' p={2}>
              <Tabs w='full' variant='default'>
                <TabList>
                  <Tab>
                    <Text fontSize='xl'>Active Raids</Text>
                  </Tab>

                  <Tab>
                    <Text fontSize='xl'>Past Raids</Text>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel h='full'>
                    <Stack spacing={4} h='100%'>
                      <Stack spacing={4}>
                        {!_.isEmpty(_.get(data, 'myRaids.active')) ? (
                          _.map(
                            _.get(data, 'myRaids.active'),
                            (raid: IRaid) => (
                              <DashboardRaidCard key={raid.id} raid={raid} />
                            )
                          )
                        ) : (
                          <Flex pt={10} justify='center'>
                            <Heading fontFamily='spaceMono' size='sm'>
                              No Active Raids
                            </Heading>
                          </Flex>
                        )}
                      </Stack>
                    </Stack>
                  </TabPanel>

                  <TabPanel>
                    <Stack spacing={4}>
                      {!_.isEmpty(_.get(data, 'myRaids.past')) ? (
                        _.map(_.get(data, 'myRaids.past'), (raid: IRaid) => (
                          <MiniRaidCard key={raid.id} raid={raid} />
                        ))
                      ) : (
                        <Heading>No Past Raids</Heading>
                      )}
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>

            <MemberDetailsCard
              member={member}
              application={_.get(member, 'application')}
              width='500px'
              height='650px'
              showHeader
            />
          </Flex>

          <Card variant='filled' w='100%' p={2}>
            <Tabs w='100%' variant='default'>
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
                          <DashboardRaidCard
                            key={consultation.id}
                            consultation={consultation}
                            newRaid
                          />
                        )
                      )
                    ) : (
                      <Flex justify='center' pt={10}>
                        <Heading fontFamily='spaceMono' size='sm'>
                          No pending consultations
                        </Heading>
                      </Flex>
                    )}
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={4}>
                    {_.map(_.get(data, 'newRaids'), (raid: IRaid) => (
                      <DashboardRaidCard key={raid.id} raid={raid} newRaid />
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </Stack>
      </SiteLayout>
    </>
  );
};

export default Home;
