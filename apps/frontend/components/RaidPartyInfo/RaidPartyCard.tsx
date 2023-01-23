/* eslint-disable react/no-unstable-nested-components */
// TODO don't nest this component
import _ from 'lodash';
import { ReactNode, useState } from 'react';
import {
  Flex,
  HStack,
  Text,
  RoleBadge,
  IconButton,
  Icon,
  Avatar,
  // AvatarGroup,
  ChakraSelect,
  Button,
  Box,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import { FiX, FiCheck } from 'react-icons/fi';
import { HiSwitchVertical } from 'react-icons/hi';
import ChakraNextLink from '../ChakraNextLink';
import {
  GUILD_CLASS_ICON,
  GUILD_CLASS_DISPLAY,
  IMember,
  memberDisplayName,
  SIDEBAR_ACTION_STATES,
  IRaid,
} from '../../utils';
import {
  useRaidUpdate,
  useRaidPartyRemove,
  useRemoveRolesRequired,
} from '../../hooks';
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
  isRole,
  setButtonSelection,
}: RaidPartyCardProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const [updateCleric, setUpdateCleric] = useState(false);
  const [localRoles, setLocalRoles] = useState(roles);
  const [clearRoles, setClearRoles] = useState(false);
  const [clericToAdd, setClericToAdd] = useState<string>();

  const { mutateAsync: updateRaid } = useRaidUpdate({
    token,
    raidId: _.get(raid, 'id'),
  });
  const { mutateAsync: removeRaider } = useRaidPartyRemove({ token });
  const { mutateAsync: removeRolesRequired } = useRemoveRolesRequired({
    token,
  });

  // * fallback to current user
  const submitUpdatedCleric = async () => {
    const raidUpdates = {
      cleric_id: clericToAdd || _.get(session, 'user.id'),
    };

    await updateRaid({
      id: _.get(raid, 'id'),
      raid_updates: raidUpdates,
    });
    setTimeout(() => {
      setUpdateCleric(false);
      setClericToAdd(undefined);
    }, 250);
  };

  const handleSwitchCleric = () => {
    setButtonSelection(SIDEBAR_ACTION_STATES.cleric);
    setUpdateCleric(true);
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

  // TODO holy refactor
  const saveUpdatedRoles = async () => {
    const rolesRemoved = _.difference(roles, localRoles);
    // const rolesAdded = _.difference(localRoles, roles);

    let rolesRemovedWhere = null;
    // setClearRoles(false);
    if (!_.isEmpty(rolesRemoved)) {
      if (rolesRemoved.length === 1) {
        rolesRemovedWhere = {
          _and: {
            raid_id: _.get(raid, 'id'),
            role: rolesRemoved[0],
          },
        };
      }
      if (rolesRemoved.length > 1) {
        rolesRemovedWhere = {
          _or: rolesRemoved.map((role: string) => ({
            _and: {
              raid_id: _.get(raid, 'id'),
              role,
            },
          })),
        };
      }
      if (!rolesRemovedWhere) return;

      // console.log('remove roles');
      await removeRolesRequired({
        where: rolesRemovedWhere,
      });
    }
  };

  const GeneralCard = ({ button, children }: GeneralCardProps) => (
    <Flex
      key={_.get(member, 'id', 'roles')}
      justify='space-between'
      align='center'
    >
      {(isCleric && (!member || updateCleric)) || isRole ? (
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

  if (member && isCleric) {
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
            onClick={handleSwitchCleric}
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
  if (isCleric) {
    return (
      <GeneralCard
        button={
          updateCleric ? (
            <Button onClick={submitUpdatedCleric}>Go</Button>
          ) : (
            <Button variant='outline' onClick={submitUpdatedCleric}>
              Claim
            </Button>
          )
        }
      >
        <Flex>
          {updateCleric ? (
            <HStack w='100%'>
              <IconButton
                variant='outline'
                icon={<Icon as={FiX} color='primary.300' />}
                aria-label='Clear Set Raider for Raid'
                onClick={() => setUpdateCleric(false)}
              />
              {!_.isEmpty(members) && (
                <ChakraSelect
                  value={clericToAdd}
                  onChange={(e) => setClericToAdd(e.target.value)}
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

  // * Remove role icon
  // <Icon
  //     as={FiX}
  //     bg="raid"
  //     color="white"
  //     position="absolute"
  //     borderRadius={10}
  //     top="-2"
  //     right="-2"
  //     aria-label={`Remove ${role} role`}
  //     _hover={{ cursor: 'pointer' }}
  //     // onClick={() => removeLocalRole(role)}
  //   />

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
