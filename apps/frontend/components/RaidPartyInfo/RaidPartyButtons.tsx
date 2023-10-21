/* eslint-disable react/no-unstable-nested-components */
// TODO fix these
import { useState } from 'react';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import {
  VStack,
  HStack,
  Button,
  IconButton,
  ChakraSelect,
  Box,
  Icon,
  Flex,
  Select,
} from '@raidguild/design-system';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  memberDisplayName,
  GUILD_CLASS_DISPLAY,
  IMember,
  IRaid,
  membersExceptRaidParty,
  SIDEBAR_ACTION_STATES,
  rolesExceptRequiredRoles,
  GUILD_CLASS_OPTIONS,
} from '@raidguild/dm-utils';
import { useRaidPartyAdd, useAddRolesRequired } from '@raidguild/dm-hooks';
import { useForm } from 'react-hook-form';

type RaidPartyButtonsProps = {
  raid?: Partial<IRaid>;
  cleric?: Partial<IMember>;
  raidParty?: Partial<IMember>[];
  members?: Partial<IMember>[];
  button?: string;
  setButton?: (button: string) => void;
};

// TODO swap for better selects

const RaidPartyButtons = ({
  raid,
  cleric,
  raidParty,
  members,
  button,
  setButton,
}: RaidPartyButtonsProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const localMembers = membersExceptRaidParty(members, raidParty, cleric);
  const requiredRoles = _.map(_.get(raid, 'raidsRolesRequired'), 'role');
  const rolesFormDefaultValues = _.map(requiredRoles, (r) => ({
    value: r,
    label: GUILD_CLASS_DISPLAY[r],
  }));
  const localRoles = rolesExceptRequiredRoles(
    _.keys(GUILD_CLASS_DISPLAY),
    raid
  );
  const [roleToAdd, setRoleToAdd] = useState<string>();
  const [raiderToAdd, setRaiderToAdd] = useState<string>();
  const localForm = useForm({
    mode: 'all',
  });

  const { mutateAsync: updateRolesRequired } = useAddRolesRequired({
    token,
  });
  const { mutateAsync: addRaider } = useRaidPartyAdd({ token });

  const submitAddRole = async () => {
    // TODO check against current localRoles
    await updateRolesRequired({
      raidId: _.get(raid, 'id'),
      role: roleToAdd,
    });
    setTimeout(() => {
      setRoleToAdd(undefined);
      setButton(SIDEBAR_ACTION_STATES.none);
    }, 250);
  };

  // TODO clear click for selecting roles to remove in one save
  // const clearRoleClick = () => {
  //   if (clearRoles) {
  //     // setClearRoles(false);
  //     setLocalRoles(_.get(raid, 'rolesRequired'));
  //   } else {
  //     // setClearRoles(true);
  //   }
  // };

  const submitAddRaider = async () => {
    await addRaider({
      raidId: _.get(raid, 'id'),
      memberId: raiderToAdd,
    });

    setTimeout(() => {
      setRaiderToAdd(undefined);
      setButton(SIDEBAR_ACTION_STATES.none);
    }, 250);
  };

  const StartProcess = () => (
    <Button
      variant='link'
      leftIcon={<FiPlus />}
      onClick={() => setButton(SIDEBAR_ACTION_STATES.select)}
    >
      Add Raider or Update Roles
    </Button>
  );

  const SelectRaiderOrRoleButton = () => (
    <HStack>
      <Button
        variant='outline'
        onClick={() => {
          setButton(SIDEBAR_ACTION_STATES.raider);
          setRaiderToAdd(_.get(_.first(localMembers), 'id'));
        }}
      >
        Add Raider
      </Button>
      <Button
        variant='outline'
        onClick={() => {
          setButton(SIDEBAR_ACTION_STATES.role);
          setRoleToAdd(_.keys(GUILD_CLASS_DISPLAY)[0]);
        }}
      >
        Update Roles
      </Button>
    </HStack>
  );

  const SelectRole = () => (
    <Flex justify='space-between' gap={1} w='100%'>
      <IconButton
        variant='outline'
        icon={<Icon as={FiX} color='primary.500' />}
        aria-label='Clear Set Role Required for Raid'
        onClick={() => {
          setButton(SIDEBAR_ACTION_STATES.none);
          setRoleToAdd(undefined);
        }}
      />
      {/* <ChakraSelect
        onChange={(e) => setRoleToAdd(e.target.value)}
        value={roleToAdd}
      >
        {_.map(localRoles, (key: string) => (
          <option value={key} key={key}>
            {GUILD_CLASS_DISPLAY[key]}
          </option>
        ))}
      </ChakraSelect> */}
      <Select
        name={'Update Roles Select'}
        variant='outline'
        options={GUILD_CLASS_OPTIONS}
        localForm={localForm}
        isMulti
        placeholder='Select Roles'
        defaultValue={rolesFormDefaultValues}
        // onChange={} is this needed?
      />
      <Button onClick={submitAddRole}>Update</Button>
    </Flex>
  );

  // TODO handle loading a bit better
  const SelectRaider = () => (
    <Flex justify='space-between' gap={1} w='100%'>
      <IconButton
        variant='outline'
        icon={<Icon as={FiX} color='primary.500' />}
        aria-label='Clear Set Raider for Raid'
        onClick={() => {
          setButton(SIDEBAR_ACTION_STATES.none);
          setRaiderToAdd(undefined);
        }}
      />
      {_.isEmpty(localMembers) ? (
        <Box>No Raiders Found!</Box>
      ) : (
        <ChakraSelect
          onChange={(e) => setRaiderToAdd(e.target.value)}
          value={raiderToAdd}
        >
          {_.map(localMembers, (m: IMember) => (
            <option value={m.id} key={m.id}>
              {memberDisplayName(m)}
            </option>
          ))}
        </ChakraSelect>
      )}

      <Button onClick={submitAddRaider}>Add</Button>
    </Flex>
  );

  return (
    <VStack align='center' width='100%' marginTop={2}>
      {(button === SIDEBAR_ACTION_STATES.none ||
        button === SIDEBAR_ACTION_STATES.cleric) && <StartProcess />}
      {button === SIDEBAR_ACTION_STATES.select && <SelectRaiderOrRoleButton />}
      {button === SIDEBAR_ACTION_STATES.role && <SelectRole />}
      {button === SIDEBAR_ACTION_STATES.raider && <SelectRaider />}
    </VStack>
  );
};

export default RaidPartyButtons;
