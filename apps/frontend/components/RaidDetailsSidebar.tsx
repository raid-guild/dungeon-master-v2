import React, { useState, useEffect } from 'react';
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
import { camelize, GUILD_CLASS_ICON, IMember } from '../utils';
// import StatusUpdateForm from '@/components/StatusUpdateForm';
// import ModalWrapper from '@/components/ModalWrapper';
import RaidPartyInfo from './RaidPartyInfo';

interface RaidDetailsSidebarProps {
  raidId: string;
  cleric: Partial<IMember>;
  status: string;
  raidParty: Partial<IMember>[];
  raidPartyId: string;
  rolesRequired: string[];
  tags: string[];
  updateRaid: any;
}

const RAID_PARTY_STATES = {
  none: 'NONE',
  select: 'SELECT',
  raider: 'RAIDER',
  role: 'ROLE',
};

const RaidDetailsSidebar: React.FC<RaidDetailsSidebarProps> = ({
  raidId,
  cleric,
  status,
  raidParty,
  raidPartyId,
  rolesRequired,
  tags = ['Help Needed', 'Trucking'],
  updateRaid,
}: RaidDetailsSidebarProps) => {
  const [addRoleRaider, setAddRoleRaider] = useState<string>(
    RAID_PARTY_STATES.none
  );
  const [roleToAdd, setRoleToAdd] = useState<string>();
  const [raiderToAdd, setRaiderToAdd] = useState<string>();
  const [raiders, setRaiders] = useState<IMember[]>();
  const toast = useToast();
  const updateStatusModal = useDisclosure();

  const submitAddRole = async () => {
    const localRolesRequired = rolesRequired
      ? [...rolesRequired, roleToAdd]
      : [roleToAdd];
  };

  const submitAddRaider = async () => {
    console.log('submit add');
  };

  // useEffect(() => {
  //   // TODO clear async
  //   const apolloClient = initializeApollo();
  //   const fetchRaiders = async () => {
  //     const result = await apolloClient.query({ query: MEMBERS });
  //     const localMembers = camelize(result.data.members);
  //     const raidPartyIds = raidParty?.map((m) => m.id);
  //     const filteredMembers = localMembers.filter(
  //       (m) => !raidPartyIds?.includes(m.id)
  //     );
  //     setRaiders(
  //       filteredMembers.sort((raiderOne, raiderTwo) =>
  //         raiderOne.name.toLowerCase() > raiderTwo.name.toLowerCase() ? 1 : -1
  //       )
  //     );
  //   };
  //   if (
  //     addRoleRaider !== RAID_PARTY_STATES.none &&
  //     (!raiders || raiders?.length === 0)
  //   ) {
  //     fetchRaiders();
  //   }
  // }, [addRoleRaider, raidParty, raiders]);

  return (
    <Box width="100%" height="100vh" marginTop="10vh">
      <Flex direction="column" alignItems="flex-start">
        <HStack
          rounded="md"
          backgroundColor="gray.600"
          width="100%"
          alignItems="center"
          justifyContent="center"
          paddingY={1}
          marginBottom={8}
          onClick={updateStatusModal.onOpen}
          _hover={{ cursor: 'pointer', bg: 'gray.500' }}
        >
          <Text as="span" fontSize="2xl">
            {status}
          </Text>
        </HStack>
        {/* <ModalWrapper
          size="sm"
          title="Update Raid Status"
          isOpen={updateStatusModal.isOpen}
          onClose={updateStatusModal.onClose}
          content={
            <StatusUpdateForm
              raidId={raidId}
              currentStatus={status}
              closeModal={updateStatusModal.onClose}
              updateRaid={updateRaid}
            />
          }
        /> */}
        <Flex direction="column" width="100%" marginTop={4}>
          <Heading color="white" as="h3" fontSize="2xl">
            Raid Party
          </Heading>
          <Box
            height="auto"
            rounded="md"
            width="100%"
            bg="gray.800"
            marginY={4}
          >
            <RaidPartyInfo
              raidId={raidId}
              cleric={cleric}
              raidParty={raidParty}
              rolesRequired={rolesRequired}
              updateRaid={updateRaid}
            />
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
                  icon={<Icon as={FiX} color="raid" />}
                  aria-label="Clear Set Role Required for Raid"
                  onClick={() => setAddRoleRaider(RAID_PARTY_STATES.none)}
                />
                {/* <Select onChange={(e) => setRoleToAdd(e.target.value)}>
                  {guildClassMap.map((c) => (
                    <option value={c.guildClass} key={c.guildClass}>
                      {c.guildClass}
                    </option>
                  ))}
                </Select> */}
                <Button onClick={submitAddRole}>Add</Button>
              </HStack>
            )}
            {addRoleRaider === RAID_PARTY_STATES.raider && (
              <HStack w="100%">
                <IconButton
                  variant="outline"
                  icon={<Icon as={FiX} color="raid" />}
                  aria-label="Clear Set Raider for Raid"
                  onClick={() => setAddRoleRaider(RAID_PARTY_STATES.none)}
                />
                {raiders?.length > 0 ? (
                  <Select onChange={(e) => setRaiderToAdd(e.target.value)}>
                    {raiders?.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.ensName || c.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Box>No Raiders Found!</Box>
                )}

                <Button onClick={submitAddRaider}>Add</Button>
              </HStack>
            )}
          </VStack>
        </Flex>
        <Flex direction="column" width="100%" marginTop={8}>
          <Heading color="white" as="h3" fontSize="2xl">
            Project Tags
          </Heading>
          <Box
            rounded="md"
            height="auto"
            width="100%"
            bg="gray.800"
            marginY={4}
            paddingX={4}
            paddingY={4}
          >
            {tags.map((tag) => (
              <Tag
                key={tag}
                borderRadius="full"
                size="md"
                variant="solid"
                colorScheme="blackAlpha"
                marginX={2}
              >
                <TagLabel padding={1} color="gray.100">
                  {tag}
                </TagLabel>
                <TagCloseButton isDisabled />
              </Tag>
            ))}
          </Box>
          <VStack align="center" width="100%" marginTop={2}>
            <Button variant="link" leftIcon={<FiPlus />} isDisabled>
              Add Tag
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RaidDetailsSidebar;
