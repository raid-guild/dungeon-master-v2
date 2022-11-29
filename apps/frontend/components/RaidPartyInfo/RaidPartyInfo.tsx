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
} from '../../utils';
import { useSlimMemberList } from '../../hooks/useMemberList';
import RaidPartyButtons from './RaidPartyButtons';
import MemberAvatar from '../MemberAvatar';
import RaidPartyCard from './RaidPartyCard';

interface RaidInfoProps {
  raid?: Partial<IRaid>;
  consultation?: IConsultation;
}

const RaidPartyInfo: React.FC<RaidInfoProps> = ({ raid }: RaidInfoProps) => {
  const [clearRoles, setClearRoles] = useState(false);
  const [localRoles, setLocalRoles] = useState<string[]>(
    _.map(_.get(raid, 'rolesRequired'), 'role')
  );

  const [raiders, setRaiders] = useState<any[]>();
  const [clericToAdd, setClericToAdd] = useState<string>();

  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: members } = useSlimMemberList({ token });

  const cleric = _.get(raid, 'memberByCleric');
  const raidParty = _.map(_.get(raid, 'raidParty'), 'memberByMember');

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

  const submitUpdatedCleric = async (e) => {
    console.log('submit updated cleric');
  };

  const submitClearCleric = async () => {
    console.log('submit clear cleric');
  };

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
                <RaidPartyCard member={cleric} members={members} isCleric />
              </Stack>
            </Flex>
            {!_.isEmpty(raidParty) && (
              <Stack spacing={4}>
                <Divider />
                <Heading size="sm">Raiders</Heading>
                {_.map(raidParty, (member: Partial<IMember>) => (
                  <RaidPartyCard member={member} />
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
          cleric={cleric}
          raidParty={raidParty}
          members={members}
        />
      </Stack>
    </Stack>
  );
};

export default RaidPartyInfo;
