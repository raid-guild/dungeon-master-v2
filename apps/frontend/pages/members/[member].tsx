import _ from 'lodash';
import {
  Flex,
  Avatar,
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

const activeStatus = ['AWAITING', 'PREPARING', 'RAIDING'];

// TODO remove hardcoded limits on past and active raids

const Member = () => {
  const router = useRouter();
  const memberAddress = _.get(router, 'query.member');
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: member } = useMemberDetail({ token, memberAddress });
  const { data: ensAvatar } = useEnsAvatar({
    address: _.get(member, 'ethAddress'),
    chainId: 1,
    enabled: _.get(member, 'ethAddress') !== '0x',
  });
  const pastAndActiveRaids = {
    active: _.filter(_.map(_.get(member, 'raidParties'), 'raid'), (r) =>
      _.includes(activeStatus, _.get(r, 'raidStatus.raidStatus'))
    ),
    past: _.filter(
      _.map(_.get(member, 'raidParties'), 'raid'),
      (r) => !_.includes(activeStatus, _.get(r, 'raidStatus.raidStatus'))
    ),
  };

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
        <Flex w="100%" direction={['column', null, null, 'row']} gap={6}>
          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
          />
          {/* <RaidsFeed /> */}
          <Flex
            direction="column"
            w={['100%', null, null, '30%']}
            ml={[null, null, null, '4']}
            bg="gray.800"
            rounded="md"
            style={{ backdropFilter: 'blur(7px)' }}
            p={8}
          >
            {!_.isEmpty(_.get(pastAndActiveRaids, 'active')) && (
              <Stack mb={4}>
                <Heading size="sm">Active Raids</Heading>
                <Stack>
                  {_.map(
                    _.get(pastAndActiveRaids, 'active').slice(0, 2),
                    (raid) => (
                      <MiniRaidCard
                        key={_.get(raid, 'id')}
                        raid={raid}
                        noAvatar
                        smallHeader
                      />
                    )
                  )}
                </Stack>
              </Stack>
            )}
            {!_.isEmpty(_.get(pastAndActiveRaids, 'past')) && (
              <Stack>
                <Heading size="sm">Past Raids</Heading>
                <Stack>
                  {_.map(
                    _.get(pastAndActiveRaids, 'past').slice(0, 3),
                    (raid) => (
                      <MiniRaidCard
                        key={_.get(raid, 'id')}
                        raid={raid}
                        noAvatar
                        smallHeader
                      />
                    )
                  )}
                </Stack>
              </Stack>
            )}
          </Flex>
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
