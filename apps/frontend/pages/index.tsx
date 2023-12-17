import {
  Flex,
  Heading,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@raidguild/design-system';
import { useDashboardList, useMemberDetail } from '@raidguild/dm-hooks';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import React from 'react';
import { useAccount } from 'wagmi';

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
        <Heading variant='shadow' size='lg'>
          Raider Dashboard
        </Heading>
        <Flex
          direction={['column', null, null, 'row']}
          alignItems='flex-start'
          justify='space-between'
          w='100%'
        >
          {userRaids && (
            <Stack
              spacing={6}
              w={['90%', null, null, '50%']}
              bgColor='gray.800'
              p={5}
              rounded='lg'
              h='100%'
            >
              {/* <Heading size='lg'>My Raids</Heading> */}
              <Tabs colorScheme='primary.500' variant='unstyled'>
                <TabList fontFamily='texturina'>
                  <Tab
                    fontWeight={500}
                    _selected={{
                      color: 'primary.500',
                      borderBottomColor: 'primary.500',
                      borderBottomWidth: '2px'
                    }}
                  >
                    <Text fontSize='xl'>Active Raids</Text>
                  </Tab>

                  <Tab
                    fontWeight={500}
                    _selected={{
                      color: 'primary.500',
                      borderBottomColor: 'primary.500',
                      borderBottomWidth: '2px'
                    }}
                  >
                    <Text fontSize='xl'>Past Raids</Text>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Stack spacing={4} h='100%'>
                      <Stack spacing={4}>
                        {!_.isEmpty(_.get(data, 'myRaids.active')) ? (
                          _.map(
                            _.get(data, 'myRaids.active'),
                            (raid: IRaid) => (
                              <MiniRaidCard key={raid.id} raid={raid} />
                            )
                          )
                        ) : (
                          <Heading size='lg'>No Active Raids</Heading>
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
            </Stack>
          )}

          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
            width='500px'
          />
        </Flex>

        <Flex
          direction={['column', null, null, 'row']}
          alignItems='flex-start'
          justify='space-between'
          w='100%'
        >
        <Stack
            spacing={6}
            w={['90%', null, null, '100%']}
            bgColor='gray.800'
            p={5}
            rounded='lg'
            h='full'
          >
            {/* <Heading size='lg'>Incoming</Heading> */}
            <Tabs colorScheme='primary.500' variant='unstyled'>
              <TabList fontFamily='texturina'>
                <Tab
                  fontWeight={500}
                  _selected={{
                    color: 'primary.500',
                    borderBottomColor: 'primary.500',
                    borderBottomWidth: '2px'
                  }}
                >
                  <Text fontSize='xl'>Pending Consultations</Text>
                </Tab>
                <Tab
                  fontWeight={500}
                  _selected={{
                    color: 'primary.500',
                    borderBottomColor: 'primary.500',
                    borderBottomWidth: '2px'
                  }}
                >
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
