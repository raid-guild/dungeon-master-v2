import {
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from '@raidguild/design-system';
import {
  useDashboardList,
  useMemberDetail,
  usePagination,
} from '@raidguild/dm-hooks';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@raidguild/ui';
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
  } = usePagination(activeRaids, 4);

  const {
    currentItems: currentPastRaids,
    currentPage: pastRaidsPage,
    setPage: setPastRaidsPage,
    totalPages: totalPastRaidsPages,
  } = usePagination(pastRaids, 4);

  const {
    currentItems: currentNewConsultations,
    currentPage: newConsultationsPage,
    setPage: setNewconsutlationsPage,
    totalPages: totalNewconsutlationsPages,
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
        <div className='flex flex-col gap-10 w-full max-w-1440 items-center justify-center'>
          <div className='flex items-center gap-4 justify-between w-full'>
            <Card className='w-full h-[650px]'>
              <CardContent>
                <Tabs className='w-full h-full' defaultValue='active'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='active'>Active Raids</TabsTrigger>
                    <TabsTrigger value='past'>Past Raids</TabsTrigger>
                  </TabsList>

                  <TabsContent value='active'>
                    <div className='flex flex-col justify-between'>
                      <div className='flex flex-col gap-4'>
                        {!_.isEmpty(_.get(data, 'myRaids.active')) ? (
                          _.map(currentActiveRaids, (raid: IRaid) => (
                            <MiniRaidCard key={raid.id} raid={raid} />
                          ))
                        ) : (
                          <div className='flex pt-10 justify-center '>
                            <h1 className='font-mono text-sm'>
                              No Active Raids
                            </h1>
                          </div>
                        )}
                      </div>

                      {totalActiveRaidsPages > 1 && (
                        <div className='flex items-center gap-2'>
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
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value='past'>
                    <div className='flex flex-col justify-between h-full'>
                      <div className='flex flex-col gap-4'>
                        {!_.isEmpty(_.get(data, 'myRaids.past')) ? (
                          _.map(currentPastRaids, (raid: IRaid) => (
                            <MiniRaidCard key={raid.id} raid={raid} />
                          ))
                        ) : (
                          <h1>No Past Raids</h1>
                        )}
                      </div>
                      {totalPastRaidsPages > 1 && (
                        <div className='flex items-center gap-2'>
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
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <MemberDetailsCard
              member={member}
              application={_.get(member, 'application')}
              width='500px'
              minHeight='650px'
              showHeader
            />
          </div>

          <Card className='w-full'>
            <CardContent>
              <Tabs className='w-full' defaultValue='pending'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='pending'>
                    Pending Consultations
                  </TabsTrigger>
                  <TabsTrigger value='recent'>Recent Raids</TabsTrigger>
                </TabsList>

                <TabsContent value='pending'>
                  <div className='flex flex-col space-y-4'>
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
                      <div className='flex justify-center pt-10'>
                        <h1 className='font-mono text-sm'>
                          No pending consultations
                        </h1>
                      </div>
                    )}

                    {totalNewconsutlationsPages > 1 && (
                      <div className='flex items-center gap-2'>
                        {[...Array(totalNewconsutlationsPages).keys()].map(
                          (page) => (
                            <Button
                              key={page}
                              variant={
                                newConsultationsPage === page + 1
                                  ? 'solid'
                                  : 'outline'
                              }
                              onClick={() => setNewconsutlationsPage(page + 1)}
                            >
                              {page + 1}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value='recent'>
                  <div className='flex flex-col space-y-4'>
                    {_.map(currentNewRaids, (raid: IRaid) => (
                      <DashboardRaidCard key={raid.id} raid={raid} newRaid />
                    ))}

                    {totalNewRaidsPages > 1 && (
                      <div className='flex items-center gap-2'>
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
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    </>
  );
};

export default Home;
