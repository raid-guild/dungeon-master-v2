import {
  Avatar,
  Button,
  ChakraSelect,
  Flex,
  HStack,
  Icon,
  IconButton,
  RoleBadge,
  Text,
} from '@raidguild/design-system';
import { useRaidPartyRemove, useRaidUpdate } from '@raidguild/dm-hooks';
import { IMember, IRaid } from '@raidguild/dm-types';
import {
  GUILD_CLASS_DISPLAY,
  GUILD_CLASS_ICON,
  memberDisplayName,
  SIDEBAR_ACTION_STATES,
} from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { HiSwitchVertical } from 'react-icons/hi';

import MemberAvatar from '../MemberAvatar';
import MemberRoleStack from '../MemberRoleStack';

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
  // update fns
  setButtonSelection?: (buttonSelection: string) => void;
};

const RaidPartyCard = ({
  raid,
  member,
  members,
  roles,
  isCleric,
  isHunter,
  setButtonSelection,
}: RaidPartyCardProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const [updateMember, setUpdateMember] = useState(false);
  const [memberToAdd, setMemberToAdd] = useState<string>();

  const { mutateAsync: updateRaid } = useRaidUpdate({
    token,
    raidId: _.get(raid, 'id'),
  });
  const { mutateAsync: removeRaider } = useRaidPartyRemove({ token });

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

  if ((isCleric || isHunter) && !updateMember) {
    return (
      <MemberRoleStack
        member={member}
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
        withLink
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
            <Text
              color='whiteAlpha.600'
              fontSize='xs'
              textTransform='uppercase'
            >
              {GUILD_CLASS_DISPLAY[_.get(member, 'guildClass.guildClass')]}
            </Text>
          </Flex>
        </HStack>
      </MemberRoleStack>
    );
  }
  if (isHunter || isCleric) {
    return (
      <MemberRoleStack
        member={member}
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
      </MemberRoleStack>
    );
  }

  if (roles) {
    return (
      <MemberRoleStack>
        <HStack spacing={1}>
          {!_.isEmpty(roles) ? (
            _.map(roles, (role: string, i) => (
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
              />
            ))
          ) : (
            <Text color='whiteAlpha.600'>No Roles Needed</Text>
          )}
        </HStack>
      </MemberRoleStack>
    );
  }

  // DEFAULT OPTION IS RAIDER CARD
  return (
    <MemberRoleStack
      member={member}
      button={
        <IconButton
          onClick={() => submitRemoveRaider(_.get(member, 'id'))}
          icon={<Icon as={FiX} color='primary.500' fontSize='1.5rem' />}
          aria-label='Remove Raider'
          variant='outline'
        />
      }
      withLink
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
          <Text color='whiteAlpha.600' fontSize='xs' textTransform='uppercase'>
            {GUILD_CLASS_DISPLAY[_.get(member, 'guildClass.guildClass')]}
          </Text>
        </Flex>
      </HStack>
    </MemberRoleStack>
  );
};

export default RaidPartyCard;
