import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Flex,
  AvatarGroup,
  HStack,
  Button,
  Avatar,
  Text,
  Stack,
  Box,
  IconButton,
  Icon,
  Tooltip,
  ChakraSelect,
  Heading,
  RoleBadge,
} from '@raidguild/design-system';
import { FiUser, FiX, FiCheck } from 'react-icons/fi';
import {
  IMember,
  GUILD_CLASS_ICON,
  GUILD_CLASS_DISPLAY,
  IRaid,
  IConsultation,
  SIDEBAR_ACTION_STATES,
} from '../../utils';
import { useSlimMemberList, useRaidUpdate } from '../../hooks';

import RaidPartyButtons from './RaidPartyButtons';
import MemberAvatar from '../MemberAvatar';
import RaidPartyCard from './RaidPartyCard';

interface RaidInfoProps {
  raid?: Partial<IRaid>;
  consultation?: IConsultation;
}

const RaidPartyInfo: React.FC<RaidInfoProps> = ({ raid }: RaidInfoProps) => {
  const [buttonSelection, setButtonSelection] = useState<string>(
    SIDEBAR_ACTION_STATES.none
  );
  const [clearRoles, setClearRoles] = useState(false);
  const [localRoles, setLocalRoles] = useState<string[]>(
    _.map(_.get(raid, 'raidsRolesRequired'), 'role')
  );
  const [raiders, setRaiders] = useState<any[]>();

  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: members } = useSlimMemberList({
    token,
    button: buttonSelection,
  });
  const { mutateAsync: updateRaid } = useRaidUpdate({
    token,
    raidId: _.get(raid, 'id'),
  });

  const cleric = _.get(raid, 'cleric');
  const raidParty = _.map(_.get(raid, 'raidParties'), 'member');

  const removeLocalRole = (role) => {
    setLocalRoles(localRoles.filter((r) => r !== role));
  };

  const clearRoleClick = () => {
    if (clearRoles) {
      setClearRoles(false);
      setLocalRoles(_.get(raid, 'rolesRequired'));
    } else {
      setClearRoles(true);
    }
  };

  const submitUpdatedRoles = async () => {
    console.log('submit updated roles');
  };

  // TODO do we want?
  // const submitClearCleric = async () => {
  //   await updateRaid({
  //     id: _.get(raid, 'id'),
  //     raid_updates: {
  //       cleric_id: null,
  //     },
  //   });
  // };

  const Divider = () => (
    <Box
      borderBottomColor="whiteAlpha.400"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
    />
  );

  return (
    <Stack spacing={3}>
      <Heading size="md">Raid Party</Heading>
      <Stack spacing={5}>
        <Box rounded="md" bg="gray.800">
          <Stack p={4}>
            <Flex direction="column" py={2}>
              <Stack>
                <Heading size="sm">Cleric</Heading>
                <RaidPartyCard
                  raid={raid}
                  member={cleric}
                  members={members}
                  isCleric
                  setButtonSelection={setButtonSelection}
                />
              </Stack>
            </Flex>
            {!_.isEmpty(raidParty) && (
              <Stack spacing={4}>
                <Divider />
                <Heading size="sm">Raiders</Heading>
                {_.map(raidParty, (member: Partial<IMember>) => (
                  <RaidPartyCard
                    raid={raid}
                    member={member}
                    key={_.get(member, 'id')}
                  />
                ))}
              </Stack>
            )}
            {!_.isEmpty(localRoles) && (
              <Stack spacing={2}>
                <Divider />
                <Heading size="sm">Recruiting</Heading>
                <RaidPartyCard roles={localRoles} isRole />
              </Stack>
            )}
          </Stack>
        </Box>
        <RaidPartyButtons
          raid={raid}
          cleric={cleric}
          raidParty={raidParty}
          members={members}
          button={buttonSelection}
          setButton={setButtonSelection}
        />
      </Stack>
    </Stack>
  );
};

export default RaidPartyInfo;
