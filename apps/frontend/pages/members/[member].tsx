import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  RoleBadge,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@raidguild/design-system';
import { useMemberDetail } from '@raidguild/dm-hooks';
import { GUILD_CLASS_ICON, memberDisplayName } from '@raidguild/dm-utils';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useAccount } from 'wagmi';

import MemberAvatar from '../../components/MemberAvatar';
import MemberDetailsCard from '../../components/MemberDetailsCard';
import UpdateMemberForm from '../../components/MemberUpdateForm';
import MiniRaidCard from '../../components/MiniRaidCard';
import ModalWrapper from '../../components/ModalWrapper';
import SiteLayout from '../../components/SiteLayout';
import { useOverlay } from '../../contexts/OverlayContext';

// TODO remove hardcoded limits on past and active raids

type Props = {
  memberAddress: string;
};

const Member = ({ memberAddress }: Props) => {
  const { address } = useAccount();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { data } = useMemberDetail({ memberAddress, token });
  const member = _.get(data, 'member');
  const raids = _.get(data, 'raids');

  const localOverlay = useOverlay();
  const { setModals, closeModals } = localOverlay;

  const handleShowUpdateModal = () => {
    setModals({ memberForm: true });
  };

  const userProfile = _.toLower(address) === _.toLower(memberAddress);
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
            <MemberAvatar member={member} size={8} />
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
              {userProfile && (
                <Button variant='outline' onClick={handleShowUpdateModal}>
                  Edit
                </Button>
              )}
            </HStack>
          </Flex>
        }
      >
        <Flex
          w='100%'
          direction={['column', null, null, 'row']}
          gap={4}
          justify='center'
        >
          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
          />
          {/* <RaidsFeed /> */}
          {(!_.isEmpty(_.get(raids, 'active')) ||
            !_.isEmpty(_.get(raids, 'past'))) && (
            <Card variant='filled' w={['100%', null, null, '35%']}>
              <Tabs w='100%' variant='default'>
                <TabList>
                  {!_.isEmpty(_.get(raids, 'active')) && <Tab>Active</Tab>}
                  {!_.isEmpty(_.get(raids, 'past')) && <Tab>Past</Tab>}
                </TabList>
                <TabPanels>
                  {!_.isEmpty(_.get(raids, 'active')) && (
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
      >
        <UpdateMemberForm
          memberId={_.get(member, 'id')}
          memberAddress={memberAddress}
          member={member}
          application={_.get(member, 'application')}
          closeModal={closeModals}
        />
      </ModalWrapper>
    </>
  );
};

// * use SSR to fetch query params for RQ invalidation
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { member } = context.params;

  return {
    props: {
      memberAddress: member || null,
    },
  };
};

export default Member;
