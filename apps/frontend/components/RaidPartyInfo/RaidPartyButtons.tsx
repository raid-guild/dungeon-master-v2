/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
  ChakraSelect,
  Flex,
  HStack,
  Icon,
  IconButton,
  Select,
  VStack,
} from '@raidguild/design-system';
import { Option } from '@raidguild/design-system/dist/components/forms/CreatableSelect/CreatableSelect';
import { useRaidPartyAdd, useUpdateRolesRequired } from '@raidguild/dm-hooks';
import {
  IMember,
  IRaid,
  IRoleRemoveMany,
  IRoleRequiredInsertDb,
} from '@raidguild/dm-types';
import {
  GUILD_CLASS_DISPLAY,
  GUILD_CLASS_OPTIONS,
  memberDisplayName,
  membersExceptRaidParty,
  rolesExceptRequiredRoles,
  SIDEBAR_ACTION_STATES,
} from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiPlus, FiX } from 'react-icons/fi';

type RaidPartyButtonsProps = {
  raid?: Partial<IRaid>;
  cleric?: Partial<IMember>;
  raidParty?: Partial<IMember>[];
  members?: Partial<IMember>[];
  button?: string;
  setButton?: (button: string) => void;
};

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
  const requiredRoles: string[] = _.map(
    _.get(raid, 'raidsRolesRequired'),
    'role'
  );
  const rolesFormDefaultValues = _.map(requiredRoles, (role) => ({
    value: role,
    label: GUILD_CLASS_DISPLAY[role],
  }));

  const localRoles = rolesExceptRequiredRoles(
    _.keys(GUILD_CLASS_DISPLAY),
    raid
  );
  const localForm = useForm({
    mode: 'all',
  });
  const { control, handleSubmit } = localForm;
  const [selectedRoleOptions, setSelectedRoleOptions] = useState<Option>();
  const [raiderToAdd, setRaiderToAdd] = useState<string>();

  const { mutateAsync: updateRolesRequired } = useUpdateRolesRequired({
    token,
  });
  const { mutateAsync: addRaider } = useRaidPartyAdd({ token });

  const submitUpdateRoles = async () => {
    const selectedRoleValues: any[] = _.map(
      selectedRoleOptions,
      (selection: Option) => selection.value
    );
    const rolesAdded: string[] = _.difference(
      selectedRoleValues,
      requiredRoles
    );
    const rolesRemoved: string[] = _.difference(
      requiredRoles,
      selectedRoleValues
    );
    const raidId = _.get(raid, 'id');

    const insertRoles: IRoleRequiredInsertDb[] = _.map(rolesAdded, (role) => ({
      raid_id: raidId,
      role,
    }));
    const rolesRemovedWhere: IRoleRemoveMany = {
      _and: {
        role: { _in: rolesRemoved },
        raid_id: { _eq: raidId },
      },
    };
    await updateRolesRequired({
      insertRoles,
      where: rolesRemovedWhere,
    });

    setTimeout(() => {
      setButton(SIDEBAR_ACTION_STATES.none);
    }, 250);
  };

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
        }}
      >
        Update Roles
      </Button>
    </HStack>
  );

  const SelectRole = () => (
    // Wrap this whole component in a Chakra component to make it fill the width of its container div

    <Box width='full'>
      <form onSubmit={handleSubmit(submitUpdateRoles)}>
        <Controller
          name='updateRolesSelect'
          control={control}
          render={({ field }) => (
            <Select
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...field}
              variant='outline'
              isMulti
              placeholder='Select Roles'
              isClearable={false}
              options={GUILD_CLASS_OPTIONS}
              defaultValue={rolesFormDefaultValues}
              localForm={localForm}
              // Note: Below warning suggests this is a workaround to react hook form's intended use
              // "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
              
              onChange={(values) => {
                setSelectedRoleOptions(values as any); // temp fix
              }}
              value={selectedRoleOptions}
            />
          )}
        />
        <HStack justify='center' gap={1} w='100%'>
          <Button
            variant='outline'
            aria-label='Clear Set Role Required for Raid'
            onClick={() => {
              setButton(SIDEBAR_ACTION_STATES.none);
            }}
          >
            Cancel
          </Button>
          <Button type='submit'>Update</Button>
        </HStack>
      </form>
    </Box>
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
