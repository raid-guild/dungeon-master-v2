import _ from 'lodash';
import {
  Flex,
  Avatar,
  Card,
  RoleBadge,
  Badge,
  Heading,
  Button,
  HStack,
  VStack,
  Text,
  Stack,
} from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useEnsAvatar } from 'wagmi';
import useMemberDetail from '../../hooks/useMemberDetail';
import SiteLayout from '../../components/SiteLayout';
import ModalWrapper from '../../components/ModalWrapper';
import { memberDisplayName, GUILD_CLASS_ICON } from '../../utils';
import MemberDetailsCard from '../../components/MemberDetailsCard';
import MiniRaidCard from '../../components/MiniRaidCard';
import { useOverlay } from '../../contexts/OverlayContext';
import UpdateMemberForm from '../../components/MemberUpdateForm';
import { useRouter } from 'next/router';

// TODO remove hardcoded limits on past and active raids

const Member = () => {
  const router = useRouter();
  const memberAddress = _.get(router, 'query.member');
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data } = useMemberDetail({ token, memberAddress });
  const member = _.get(data, 'member');
  const raids = _.get(data, 'raids');
  const { data: ensAvatar } = useEnsAvatar({
    address: _.get(member, 'ethAddress'),
    chainId: 1,
    enabled: _.get(member, 'ethAddress') !== '0x',
  });

  const localOverlay = useOverlay();
  const { setModals, closeModals } = localOverlay;

  const handleShowUpdateModal = () => {
    setModals({ memberForm: true });
  };
  const memberType = _.get(member, 'memberType.memberType');

  console.log('member', member);
  return (
    <>
      <NextSeo title={_.get(member, 'name')} />

      <SiteLayout
        subheader={
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            direction={['column', null, null, 'row']}
          >
            {ensAvatar ? (
              <Avatar size="lg" bg="black" src={ensAvatar} />
            ) : (
              _.get(member, 'guildClass') && (
                <Avatar
                  size="lg"
                  bg="black"
                  icon={
                    <RoleBadge
                      roleName={
                        GUILD_CLASS_ICON[_.get(member, 'guildClass.guildClass')]
                      }
                      height="64px"
                      width="64px"
                    />
                  }
                />
              )
            )}
            <Heading>{memberDisplayName(member)}</Heading>
            <HStack>
              <VStack align="start" mr={4}>
                <Badge background="blackAlpha" fontSize="sm">
                  {_.get(member, 'isRaiding') === true ? (
                    <Text>⚔️ Raiding</Text>
                  ) : (
                    <Text>⛺️ Not Raiding</Text>
                  )}
                </Badge>
                <Badge
                  marginX={1}
                  marginBottom={1}
                  color="raid"
                  bgColor="gray.700"
                >
                  {memberType}
                </Badge>
              </VStack>
              <Button variant="outline" onClick={handleShowUpdateModal}>
                Edit
              </Button>
            </HStack>
          </Flex>
        }
      >
        <Flex w="100%" direction={['column', null, null, 'row']} gap={4}>
          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
          />
          {/* <RaidsFeed /> */}
          <Card
            variant="filled"
            w={['100%', null, null, '35%']}
          >
            {!_.isEmpty(_.get(raids, 'active')) && (
              <Stack mb={4} w="100%">
                <Heading size="sm" color="white">Active Raids</Heading>
                <Stack>
                  {_.map(_.get(raids, 'active'), (raid) => (
                    <MiniRaidCard
                      key={_.get(raid, 'id')}
                      raid={raid}
                      noAvatar
                      smallHeader
                    />
                  ))}
                </Stack>
              </Stack>
            )}
            {!_.isEmpty(_.get(raids, 'past')) && (
              <Stack w="100%">
                <Heading size="sm" color="white">Past Raids</Heading>
                <Stack>
                  {_.map(_.get(raids, 'past').slice(0, 3), (raid) => (
                    <MiniRaidCard
                      key={_.get(raid, 'id')}
                      raid={raid}
                      noAvatar
                      smallHeader
                    />
                  ))}
                </Stack>
              </Stack>
            )}
          </Card>
        </Flex>
      </SiteLayout>
      <ModalWrapper
        name="memberForm"
        size="xl"
        title="Update Member Details"
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
