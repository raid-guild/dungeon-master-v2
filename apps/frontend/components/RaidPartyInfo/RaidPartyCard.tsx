/* eslint-disable react/no-unstable-nested-components */
// TODO don't nest this component
import {
  Avatar,
  // AvatarGroup,
  Box,
  Button,
  ChakraSelect,
  Flex,
  HStack,
  Icon,
  IconButton,
  RoleBadge,
  Text,
} from '@raidguild/design-system';
import {
  useRaidPartyRemove,
  useRaidUpdate,
  useRemoveRolesRequired,
} from '@raidguild/dm-hooks';
import { IMember, IRaid } from '@raidguild/dm-types';
import {
  GUILD_CLASS_DISPLAY,
  GUILD_CLASS_ICON,
  memberDisplayName,
  SIDEBAR_ACTION_STATES,
} from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { ReactNode, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { HiSwitchVertical } from 'react-icons/hi';

import ChakraNextLink from '../ChakraNextLink';
import MemberAvatar from '../MemberAvatar';

type RaidPartyCardProps = {
  /*
  | needed for updating raid
  */
  raid?: Partial<IRaid>;
  /*
  | needed for raider
  */
  member?: Partial<IMember>;
  /*
  | needed for cleric
  */
  members?: Partial<IMember>[];
  /*
  | needed for roles
  */
  roles?: string[];
  isCleric?: boolean;
  isHunter?: boolean;
  isRole?: boolean;
  // update fns
  setButtonSelection?: (buttonSelection: string) => void;
};

type GeneralCardProps = {
  button?: ReactNode;
  children: ReactNode;
};

const RaidPartyCard = ({
  raid,
  member,
  members,
  roles,
  isCleric,
  isHunter,
  isRole,
  setButtonSelection,
}: RaidPartyCardProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const [updateMember, setUpdateMember] = useState(false);
  const [localRoles, setLocalRoles] = useState(roles);
  const [clearRoles, setClearRoles] = useState(false);
  const [memberToAdd, setMemberToAdd] = useState<string>();

  const { mutateAsync: updateRaid } = useRaidUpdate({
    token,
    raidId: _.get(raid, 'id'),
  });
  const { mutateAsync: removeRaider } = useRaidPartyRemove({ token });
  const { mutateAsync: removeRolesRequired } = useRemoveRolesRequired({
    token,
  });

  // fallback to current user
  const submitUpdatedMember = async () => {
    let raidUpdates = {};
    const clericUpdate = {
      cleric_id: memberToAdd || _.get(session, 'user.id'),
    };
    const hunterUpdate = {
      hunter_id: memberToAdd || _.get(session, 'user.id'),
    };
    if (isCleric) {
      raidUpdates = { ...clericUpdate };
    }
    if (isHunter) {
      raidUpdates = { ...hunterUpdate };
    }

    await updateRaid({
      id: _.get(raid, 'id'),
      raid_updates: raidUpdates,
    });
    setTimeout(() => {
      setUpdateMember(false);
      setMemberToAdd(undefined);
    }, 250);
  };

  const handleSwitchMember = () => {
    setButtonSelection(SIDEBAR_ACTION_STATES.cleric);
    setUpdateMember(true);
  };

  const submitRemoveRaider = async (memberId: string) => {
    await removeRaider({
      raidId: _.get(raid, 'id'),
      memberId,
    });
  };

  const clearRoleClick = () => {
    if (clearRoles) {
      setClearRoles(false);
    } else {
      setClearRoles(true);
    }
  };

  const removeLocalRole = (role: string) => {
    const newRoles = localRoles.filter((r) => r !== role);
    setLocalRoles(newRoles);
  };

  const saveUpdatedRoles = async () => {
    const rolesRemoved = _.difference(roles, localRoles);
    // const rolesAdded = _.difference(localRoles, roles);
    if (!rolesRemoved) return;

    const rolesRemovedWhere = {
      _and: {
        role: { _in: rolesRemoved },
        raid_id: { _eq: _.get(raid, 'id') },
      },
    };

    // setClearRoles(false);
    await removeRolesRequired({
      where: rolesRemovedWhere,
    });
  };

  const GeneralCard = ({ button, children }: GeneralCardProps) => (
    <Flex
      key={_.get(member, 'id', 'roles')}
      justify='space-between'
      align='center'
    >
      {((isCleric || isHunter) && (!member || updateMember)) || isRole ? (
        <>
          {children}

          <Box ml={2}>{button}</Box>
        </>
      ) : (
        <>
          <ChakraNextLink href={`/members/${member.ethAddress}/`}>
            {children}
          </ChakraNextLink>
          {button}
        </>
      )}
    </Flex>
  );

  if ((isCleric || isHunter) && !updateMember) {
    return (
      <GeneralCard
        button={
          <IconButton
            icon={
              <Icon
                as={HiSwitchVertical}
                color='whiteAlpha.600'
                fontSize='1.5rem'
              />
            }
            aria-label='Switch Cleric'
            variant='outline'
            onClick={handleSwitchMember}
          />
        }
      >
        <HStack
          spacing={4}
          _hover={{ cursor: 'pointer', color: 'red.100' }}
          transition='all ease-in-out 0.25'
        >
          {member && <MemberAvatar member={member} />}

          <Flex direction='column'>
            <Text as='span' color='white' fontSize='md'>
              {_.get(member, 'name')}
            </Text>
            <Text color='primary.500' fontSize='sm'>
              {GUILD_CLASS_DISPLAY[_.get(member, 'guildClass.guildClass')]}
            </Text>
          </Flex>
        </HStack>
      </GeneralCard>
    );
  }
  if (isHunter || isCleric) {
    return (
      <GeneralCard
        button={
          updateMember ? (
            <Button onClick={submitUpdatedMember}>Go</Button>
          ) : (
            <Button variant='outline' onClick={submitUpdatedMember}>
              Claim
            </Button>
          )
        }
      >
        <Flex>
          {updateMember ? (
            <HStack w='100%'>
              <IconButton
                variant='outline'
                icon={<Icon as={FiX} color='primary.300' />}
                aria-label='Clear Set Raider for Raid'
                onClick={() => setUpdateMember(false)}
              />
              {!_.isEmpty(members) && (
                <ChakraSelect
                  value={memberToAdd}
                  onChange={(e) => setMemberToAdd(e.target.value)}
                >
                  {_.map(members, (m: Partial<IMember>) => (
                    <option value={m.id} key={m.id}>
                      {memberDisplayName(m)}
                    </option>
                  ))}
                </ChakraSelect>
              )}
            </HStack>
          ) : (
            <Flex justify='space-between' w='100%' align='center'>
              <Text px={2}>Unclaimed</Text>
            </Flex>
          )}
        </Flex>
      </GeneralCard>
    );
  }

  if (isRole && localRoles) {
    return (
      <GeneralCard
        button={
          <IconButton
            variant='outline'
            icon={
              !clearRoles ? (
                <Icon as={FiX} color='primary.500' fontSize='1.5rem' />
              ) : (
                <Icon as={FiCheck} color='primary.500' fontSize='1.5rem' />
              )
            }
            aria-label='Remove roles'
            onClick={!clearRoles ? clearRoleClick : saveUpdatedRoles}
            isDisabled
          />
        }
      >
        <HStack spacing={1}>
          {!_.isEmpty(localRoles) ? (
            _.map(localRoles, (role: string, i) => (
              <Avatar
                key={i}
                icon={
                  <RoleBadge
                    roleName={GUILD_CLASS_ICON[role]}
                    width='44px'
                    height='44px'
                    border='2px solid'
                  />
                }
              >
                {clearRoles && (
                  <Icon
                    as={FiX}
                    bg='primary.500'
                    color='white'
                    position='absolute'
                    borderRadius={10}
                    top='-5px'
                    right='-5px'
                    aria-label={`Remove ${role} role`}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => removeLocalRole(role)}
                  />
                )}
              </Avatar>
            ))
          ) : (
            <Text color='whiteAlpha.600'>No Roles Needed</Text>
          )}
        </HStack>
      </GeneralCard>
    );
  }

  // DEFAULT OPTION IS RAIDER CARD
  return (
    <GeneralCard
      button={
        <IconButton
          onClick={() => submitRemoveRaider(_.get(member, 'id'))}
          icon={<Icon as={FiX} color='primary.500' fontSize='1.5rem' />}
          aria-label='Remove Raider'
          variant='outline'
        />
      }
    >
      <HStack
        spacing={4}
        _hover={{ cursor: 'pointer', color: 'red.100' }}
        transition='all ease-in-out 0.25'
      >
        {member && <MemberAvatar member={member} />}

        <Flex direction='column'>
          <Text as='span' color='white' fontSize='md'>
            {_.get(member, 'name')}
          </Text>
          <Text color='primary.500' fontSize='sm'>
            {GUILD_CLASS_DISPLAY[_.get(member, 'guildClass.guildClass')]}
          </Text>
        </Flex>
      </HStack>
    </GeneralCard>
  );
};

export default RaidPartyCard;
