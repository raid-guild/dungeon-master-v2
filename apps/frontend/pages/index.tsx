import {
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@raidguild/design-system';
import {
  useDashboardList,
  useMemberDetail,
  usePagination,
} from '@raidguild/dm-hooks';
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

  const pastRaids = _.get(data, 'myRaids.past');
  const activeRaids = _.get(data, 'myRaids.active');
  const newConsultations = _.get(data, 'newConsultations');
  const newRaids = _.get(data, 'newRaids');
  const {
    currentItems: currentActiveRaids,
    currentPage: activeRaidsPage,
    setPage: setActiveRaidsPage,
    totalPages: totalActiveRaidsPages,
  } = usePagination(activeRaids, 3);

  const {
    currentItems: currentPastRaids,
    currentPage: pastRaidsPage,
    setPage: setPastRaidsPage,
    totalPages: totalPastRaidsPages,
  } = usePagination(pastRaids, 3);

  const {
    currentItems: currentNewConsultations,
    currentPage: newConsultationsPage,
    setPage: setNewConsulationsPage,
    totalPages: totalNewConsulationsPages,
  } = usePagination(newConsultations, 3);

  const {
    currentItems: currentNewRaids,
    currentPage: newRaidsPage,
    setPage: setNewRaidsPage,
    totalPages: totalNewRaidsPages,
  } = usePagination(newRaids, 3);

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
                          _.map(currentActiveRaids, (raid: IRaid) => (
                            <MiniRaidCard key={raid.id} raid={raid} />
                          ))
                        ) : (
                          <Flex pt={10} justify='center'>
                            <Heading fontFamily='spaceMono' size='sm'>
                              No Active Raids
                            </Heading>
                          </Flex>
                        )}
                        {totalActiveRaidsPages > 1 && (
                          <HStack>
                            {[...Array(totalActiveRaidsPages).keys()].map(
                              (page) => (
                                <Button
                                  variant={
                                    activeRaidsPage === page + 1
                                      ? 'solid'
                                      : 'outline'
                                  }
                                  key={page}
                                  onClick={() => setActiveRaidsPage(page + 1)}
                                >
                                  {page + 1}
                                </Button>
                              )
                            )}
                          </HStack>
                        )}
                      </Stack>
                    </Stack>
                  </TabPanel>

                  <TabPanel>
                    <Stack spacing={4}>
                      {!_.isEmpty(_.get(data, 'myRaids.past')) ? (
                        _.map(currentPastRaids, (raid: IRaid) => (
                          <MiniRaidCard key={raid.id} raid={raid} />
                        ))
                      ) : (
                        <Heading>No Past Raids</Heading>
                      )}

                      {totalPastRaidsPages > 1 && (
                        <HStack>
                          {[...Array(totalPastRaidsPages).keys()].map(
                            (page) => (
                              <Button
                                key={page}
                                variant={
                                  pastRaidsPage === page + 1
                                    ? 'solid'
                                    : 'outline'
                                }
                                onClick={() => setPastRaidsPage(page + 1)}
                              >
                                {page + 1}
                              </Button>
                            )
                          )}
                        </HStack>
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
                        currentNewConsultations,
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

                    {totalNewConsulationsPages > 1 && (
                      <HStack>
                        {[...Array(totalNewConsulationsPages).keys()].map(
                          (page) => (
                            <Button
                              key={page}
                              variant={
                                newConsultationsPage === page + 1
                                  ? 'solid'
                                  : 'outline'
                              }
                              onClick={() => setNewConsulationsPage(page + 1)}
                            >
                              {page + 1}
                            </Button>
                          )
                        )}
                      </HStack>
                    )}
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={4}>
                    {_.map(currentNewRaids, (raid: IRaid) => (
                      <DashboardRaidCard key={raid.id} raid={raid} newRaid />
                    ))}

                    {totalNewRaidsPages > 1 && (
                      <HStack>
                        {[...Array(totalNewRaidsPages).keys()].map((page) => (
                          <Button
                            key={page}
                            variant={
                              newRaidsPage === page + 1 ? 'solid' : 'outline'
                            }
                            onClick={() => setNewRaidsPage(page + 1)}
                          >
                            {page + 1}
                          </Button>
                        ))}
                      </HStack>
                    )}
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
