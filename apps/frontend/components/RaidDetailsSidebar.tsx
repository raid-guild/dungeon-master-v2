import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  VStack,
  Button,
  Heading,
  Select,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  camelize,
  GUILD_CLASS_DISPLAY,
  IMember,
  IRaid,
  memberDisplayName,
} from '../utils';
import StatusUpdateForm from './StatusUpdateForm';
import ModalWrapper from './ModalWrapper';
import RaidPartyInfo from './RaidPartyInfo';
import { useSlimMemberList } from '../hooks/useMemberList';
import { useSession } from 'next-auth/react';
import { membersExceptRaidParty } from '../utils/raids';
import RaidTags from './RaidTags';
import { useOverlay } from '../contexts/OverlayContext';

interface RaidDetailsSidebarProps {
  raid: Partial<IRaid>;
}

const RAID_PARTY_STATES = {
  none: 'NONE',
  select: 'SELECT',
  raider: 'RAIDER',
  role: 'ROLE',
};

const RaidDetailsSidebar: React.FC<RaidDetailsSidebarProps> = ({
  raid,
}: RaidDetailsSidebarProps) => {
  const localOverlay = useOverlay();
  const { modals, setModals, closeModals } = localOverlay;
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data } = useSlimMemberList({ token });
  const members = membersExceptRaidParty(data, _.get(raid, 'raidParty'));

  const rolesRequired = _.map(_.get(raid, 'raidsRolesRequireds'), 'role');
  const raidParty = _.map(_.get(raid, 'raidParties'), 'memberByMember');

  const [addRoleRaider, setAddRoleRaider] = useState<string>(
    RAID_PARTY_STATES.none
  );
  const [roleToAdd, setRoleToAdd] = useState<string>();
  const [raiderToAdd, setRaiderToAdd] = useState<string>();

  const handleShowStatusModal = () => {
    setModals({ raidStatus: true });
  };

  const submitAddRole = async () => {
    console.log('submit add role');
  };

  const submitAddRaider = async () => {
    console.log('submit add raider');
  };

  return (
    <Flex direction="column" alignItems="flex-start">
      <Button variant="outline" onClick={handleShowStatusModal} w="100%">
        <Text size="lg" color="white">
          {_.get(raid, 'status')}
        </Text>
      </Button>
      <ModalWrapper
        name="raidStatus"
        size="sm"
        title="Update Raid Status"
        localOverlay={localOverlay}
        content={
          <StatusUpdateForm
            raidId={_.get(raid, 'id')}
            currentStatus={_.get(raid, 'status')}
            closeModal={closeModals}
            // updateRaid={updateRaid}
          />
        }
      />
      <Flex direction="column" width="100%" marginTop={4}>
        <Heading size="md">Raid Party</Heading>
        <Box height="auto" rounded="md" width="100%" bg="gray.800" marginY={4}>
          <RaidPartyInfo raid={raid} />
        </Box>
        <VStack align="center" width="100%" marginTop={2}>
          {addRoleRaider === RAID_PARTY_STATES.select && (
            <HStack>
              <Button
                variant="outline"
                onClick={() => setAddRoleRaider(RAID_PARTY_STATES.raider)}
              >
                Add Raider
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAddRoleRaider(RAID_PARTY_STATES.role);
                  setRoleToAdd('Tavern Keeper (Community)');
                }}
              >
                Add Role
              </Button>
            </HStack>
          )}
          {addRoleRaider === RAID_PARTY_STATES.none && (
            <Button
              variant="link"
              leftIcon={<FiPlus />}
              onClick={() => setAddRoleRaider(RAID_PARTY_STATES.select)}
            >
              Add Role or Raider
            </Button>
          )}
          {addRoleRaider === RAID_PARTY_STATES.role && (
            <HStack w="100%">
              <IconButton
                variant="outline"
                icon={<Icon as={FiX} color="primary.500" />}
                aria-label="Clear Set Role Required for Raid"
                onClick={() => setAddRoleRaider(RAID_PARTY_STATES.none)}
              />
              <Select onChange={(e) => setRoleToAdd(e.target.value)}>
                {_.map(_.keys(GUILD_CLASS_DISPLAY), (key: string) => (
                  <option value={key} key={key}>
                    {GUILD_CLASS_DISPLAY[key]}
                  </option>
                ))}
              </Select>
              <Button onClick={submitAddRole}>Add</Button>
            </HStack>
          )}
          {addRoleRaider === RAID_PARTY_STATES.raider && (
            <HStack w="100%">
              <IconButton
                variant="outline"
                icon={<Icon as={FiX} color="primary.500" />}
                aria-label="Clear Set Raider for Raid"
                onClick={() => setAddRoleRaider(RAID_PARTY_STATES.none)}
              />
              {_.isEmpty(members) ? (
                <Box>No Raiders Found!</Box>
              ) : (
                <Select onChange={(e) => setRaiderToAdd(e.target.value)}>
                  {_.map(members, (c: IMember) => (
                    <option value={c.id} key={c.id}>
                      {memberDisplayName(c)}
                    </option>
                  ))}
                </Select>
              )}

              <Button onClick={submitAddRaider}>Add</Button>
            </HStack>
          )}
        </VStack>
      </Flex>
      <RaidTags raid={raid} />
    </Flex>
  );
};

export default RaidDetailsSidebar;
