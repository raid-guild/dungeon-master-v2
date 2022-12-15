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
} from '@raidguild/design-system';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  memberDisplayName,
  GUILD_CLASS_DISPLAY,
  IMember,
  IRaid,
  membersExceptRaidParty,
  SIDEBAR_ACTION_STATES,
} from '../../utils';
import { useRaidUpdate } from '../../hooks';

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
  const [localRoles, setLocalRoles] = useState<string[]>(
    _.map(_.get(raid, 'rolesRequired'), 'role')
  );
  const [roleToAdd, setRoleToAdd] = useState<string>();
  const [raiders, setRaiders] = useState<any[]>();
  const { mutateAsync: updateRaid } = useRaidUpdate({
    token,
    raidId: _.get(raid, 'id'),
  });

  const updateLocalRoles = (role: string) => {
    const newRoles = _.cloneDeep(localRoles);
    if (_.includes(_.map(newRoles, 'role'), role)) {
      _.remove(newRoles, (r) => r.role === role);
    } else {
      newRoles.push({ role });
    }
    return newRoles;
  };

  const submitAddRole = async () => {
    console.log('submit add role');
    const roles = updateLocalRoles(roleToAdd);

    // check against current localRoles
    // remove or add based on that
    await updateRaid({
      id: _.get(raid, 'id'),
      raid_updates: {
        raids_roles_required: _.map(roles, (r: string) => ({ role: r })),
      },
    });
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
    console.log('submit add raider');
  };

  const StartProcess = () => (
    <Button
      variant="link"
      leftIcon={<FiPlus />}
      onClick={() => setButton(SIDEBAR_ACTION_STATES.select)}
    >
      Add Role or Raider
    </Button>
  );

  const SelectRaiderOrRoleButton = () => (
    <HStack>
      <Button
        variant="outline"
        onClick={() => setButton(SIDEBAR_ACTION_STATES.raider)}
      >
        Add Raider
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setButton(SIDEBAR_ACTION_STATES.role);
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
        onClick={() => setButton(SIDEBAR_ACTION_STATES.none)}
      />
      <ChakraSelect
        onChange={(e) => setRoleToAdd(e.target.value)}
        value={roleToAdd}
      >
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
        onClick={() => setButton(SIDEBAR_ACTION_STATES.none)}
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
      {(button === SIDEBAR_ACTION_STATES.none ||
        button === SIDEBAR_ACTION_STATES.cleric) && <StartProcess />}
      {button === SIDEBAR_ACTION_STATES.select && <SelectRaiderOrRoleButton />}
      {button === SIDEBAR_ACTION_STATES.role && <SelectRole />}
      {button === SIDEBAR_ACTION_STATES.raider && <SelectRaider />}
    </VStack>
  );
};

export default RaidPartyButtons;
