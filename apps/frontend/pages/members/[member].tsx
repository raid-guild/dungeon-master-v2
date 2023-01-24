import _ from 'lodash';
import {
  Flex,
  Card,
  RoleBadge,
  Badge,
  Heading,
  Button,
  HStack,
  VStack,
  Text,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import useMemberDetail from '../../hooks/useMemberDetail';
import SiteLayout from '../../components/SiteLayout';
import ModalWrapper from '../../components/ModalWrapper';
import { memberDisplayName, GUILD_CLASS_ICON } from '../../utils';
import MemberDetailsCard from '../../components/MemberDetailsCard';
import MiniRaidCard from '../../components/MiniRaidCard';
import { useOverlay } from '../../contexts/OverlayContext';
import UpdateMemberForm from '../../components/MemberUpdateForm';
import MemberAvatar from '../../components/MemberAvatar';

// TODO remove hardcoded limits on past and active raids

const Member = () => {
  const router = useRouter();
  const memberAddress = _.get(router, 'query.member');
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data } = useMemberDetail({ token, memberAddress });
  const member = _.get(data, 'member');
  const raids = _.get(data, 'raids');

  const localOverlay = useOverlay();
  const { setModals, closeModals } = localOverlay;

  const handleShowUpdateModal = () => {
    setModals({ memberForm: true });
  };

  const memberType = _.get(member, 'memberType.memberType');
  const roleIcon = GUILD_CLASS_ICON[_.get(member, 'guildClass.guildClass')];

  return (
    <>
      <NextSeo title={_.get(member, 'name')} />

      <SiteLayout
        subheader={
          <Flex
            justify='space-between'
            align='center'
            w='100%'
            direction={['column', null, null, 'row']}
          >
            <MemberAvatar member={member} />
            <Heading size='lg'>{memberDisplayName(member)}</Heading>
            <HStack spacing={4}>
              <VStack align='flex-end'>
                <Badge background='whiteAlpha.300' fontSize='sm'>
                  {_.get(member, 'isRaiding') === true ? (
                    <Text>⚔️ Raiding</Text>
                  ) : (
                    <Text>⛺️ Not Raiding</Text>
                  )}
                </Badge>
                <Badge
                  marginX={1}
                  marginBottom={1}
                  color='raid'
                  bgColor='whiteAlpha.300'
                >
                  {memberType}
                </Badge>
              </VStack>
              {roleIcon && (
                <RoleBadge roleName={roleIcon} height='55px' width='55px' />
              )}
              <Button variant='outline' onClick={handleShowUpdateModal}>
                Edit
              </Button>
            </HStack>
          </Flex>
        }
      >
        <Flex w='100%' direction={['column', null, null, 'row']} gap={4}>
          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
          />
          {/* <RaidsFeed /> */}
          {(!_.isEmpty(_.get(raids, 'active')) ||
            !_.isEmpty(_.get(raids, 'past'))) && (
            <Card variant='filled' w={['100%', null, null, '35%']}>
              <Tabs>
                <TabList>
                  {!_.isEmpty(_.get(raids, 'past')) && <Tab>Active</Tab>}

                  {!_.isEmpty(_.get(raids, 'past')) && <Tab>Past</Tab>}
                </TabList>
                <TabPanels>
                  {!_.isEmpty(_.get(raids, 'past')) && (
                    <TabPanel>
                      <Stack spacing={4}>
                        {_.map(_.get(raids, 'active'), (raid) => (
                          <MiniRaidCard
                            key={_.get(raid, 'id')}
                            raid={raid}
                            noAvatar
                            smallHeader
                          />
                        ))}
                      </Stack>
                    </TabPanel>
                  )}

                  {!_.isEmpty(_.get(raids, 'past')) && (
                    <TabPanel>
                      <Stack spacing={4}>
                        {_.map(_.get(raids, 'past').slice(0, 3), (raid) => (
                          <MiniRaidCard
                            key={_.get(raid, 'id')}
                            raid={raid}
                            noAvatar
                            smallHeader
                          />
                        ))}
                      </Stack>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </Card>
          )}
        </Flex>
      </SiteLayout>
      <ModalWrapper
        name='memberForm'
        size='xl'
        title='Update Member Details'
        localOverlay={localOverlay}
        content={
          <UpdateMemberForm
            memberId={_.get(member, 'id')}
            member={member}
            application={_.get(member, 'application')}
            closeModal={closeModals}
          />
        }
      />
    </>
  );
};

export default Member;
