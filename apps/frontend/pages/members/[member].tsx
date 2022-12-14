import _ from 'lodash';
import {
  Flex,
  Avatar,
  RoleBadge,
  Badge,
  Heading,
  Button,
  HStack,
  Text,
} from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useEnsAvatar } from 'wagmi';
import useMemberDetail from '../../hooks/useMemberDetail';
import SiteLayout from '../../components/SiteLayout';
import ModalWrapper from '../../components/ModalWrapper';
import { memberDisplayName, GUILD_CLASS_ICON } from '../../utils';
import MemberDetailsCard from '../../components/MemberDetailsCard';
import { useOverlay } from '../../contexts/OverlayContext';
import UpdateMemberForm from '../../components/MemberUpdateForm';

const Member = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: member } = useMemberDetail({ token });
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

  return (
    <>
      <NextSeo title="Member" />

      <SiteLayout
        subheader={
          <Flex justify="space-between" align="center" w="100%">
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
              <Badge background="blackAlpha" fontSize="sm">
                {_.get(member, 'isRaiding') === true ? (
                  <Text>⚔️ Raiding</Text>
                ) : (
                  <Text>⛺️ Not Raiding</Text>
                )}
              </Badge>
              <Button variant="outline" onClick={handleShowUpdateModal}>
                Edit
              </Button>
            </HStack>
          </Flex>
        }
      >
        <MemberDetailsCard
          member={member}
          application={_.get(member, 'application')}
        />
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
