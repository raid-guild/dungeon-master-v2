import { useState } from 'react';
import _ from 'lodash';
import {
  VStack,
  HStack,
  Button,
  IconButton,
  ChakraSelect,
  Box,
  Icon,
} from '@raidguild/design-system';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  memberDisplayName,
  GUILD_CLASS_DISPLAY,
  IMember,
  membersExceptRaidParty,
} from '../../utils';

const STATES = {
  none: 'NONE',
  select: 'SELECT',
  raider: 'RAIDER',
  role: 'ROLE',
};

const RaidPartyButtons = ({ cleric, raidParty, members }) => {
  const [state, setState] = useState<string>(STATES.none);
  const localMembers = membersExceptRaidParty(members, raidParty, cleric);

  const submitAddRole = async () => {
    console.log('submit add role');
  };

  const submitAddRaider = async () => {
    console.log('submit add raider');
  };

  const StartProcess = () => (
    <Button
      variant="link"
      leftIcon={<FiPlus />}
      onClick={() => setState(STATES.select)}
    >
      Add Role or Raider
    </Button>
  );

  const SelectRaiderOrRoleButton = () => (
    <HStack>
      <Button variant="outline" onClick={() => setState(STATES.raider)}>
        Add Raider
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setState(STATES.role);
          // setRoleToAdd('Tavern Keeper (Community)');
        }}
      >
        Add Role
      </Button>
    </HStack>
  );

  const SelectRole = () => (
    <HStack w="100%">
      <IconButton
        variant="outline"
        icon={<Icon as={FiX} color="primary.500" />}
        aria-label="Clear Set Role Required for Raid"
        onClick={() => setState(STATES.none)}
      />
      <ChakraSelect onChange={submitAddRole}>
        {_.map(_.keys(GUILD_CLASS_DISPLAY), (key: string) => (
          <option value={key} key={key}>
            {GUILD_CLASS_DISPLAY[key]}
          </option>
        ))}
      </ChakraSelect>
      <Button onClick={submitAddRole}>Add</Button>
    </HStack>
  );

  const SelectRaider = () => (
    <HStack w="100%">
      <IconButton
        variant="outline"
        icon={<Icon as={FiX} color="primary.500" />}
        aria-label="Clear Set Raider for Raid"
        onClick={() => setState(STATES.none)}
      />
      {_.isEmpty(localMembers) ? (
        <Box>No Raiders Found!</Box>
      ) : (
        <ChakraSelect onChange={submitAddRaider}>
          {_.map(localMembers, (c: IMember) => (
            <option value={c.id} key={c.id}>
              {memberDisplayName(c)}
            </option>
          ))}
        </ChakraSelect>
      )}

      <Button>Add</Button>
    </HStack>
  );

  return (
    <VStack align="center" width="100%" marginTop={2}>
      {state === STATES.none && <StartProcess />}
      {state === STATES.select && <SelectRaiderOrRoleButton />}
      {state === STATES.role && <SelectRole />}
      {state === STATES.raider && <SelectRaider />}
    </VStack>
  );
};

export default RaidPartyButtons;
