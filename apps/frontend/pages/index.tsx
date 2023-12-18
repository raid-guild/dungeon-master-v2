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
  Text,
  VStack
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
        <VStack gap={10} maxW="1440px" w="100%" alignItems='center' justifyContent='center'>
        <Flex
          direction={['column', null, null, 'row']}
          alignItems='flex-start'
          justify='space-between'
          w='100%'
          gap={4}
        >
          <Tabs colorScheme='primary.500' variant='unstyled' w='full' h='680px'>
            <Stack
              spacing={6}
              w='100%'
              bgColor='gray.800'
              p={5}
              rounded='lg'
              h='100%'
            >
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
                <TabPanel h='full'>
                  <Stack spacing={4} h='100%'>
                    <Stack spacing={4}>
                      {!_.isEmpty(_.get(data, 'myRaids.active')) ? (
                        _.map(_.get(data, 'myRaids.active'), (raid: IRaid) => (
                          <MiniRaidCard key={raid.id} raid={raid} />
                        ))
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
            </Stack>
          </Tabs>

          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
            width='500px'
            height='680px'
          />
        </Flex>
        
    
          
           
            <Tabs colorScheme='primary.500' variant='unstyled' w="100%" mt={{base: '100px', lg: '40px' }}>
            <Stack
            spacing={6}
            bgColor='gray.800'
            p={5}
            rounded='lg'
            h='full'
          >
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
              </Stack>
            </Tabs>
        </VStack>
      </SiteLayout>
    </>
  );
};

export default Home;
