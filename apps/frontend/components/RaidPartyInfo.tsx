import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flex,
  Wrap,
  WrapItem,
  HStack,
  Button,
  Avatar,
  Text,
  Stack,
  Box,
  IconButton,
  Icon,
  Tooltip,
  Select,
  useToast,
} from '@chakra-ui/react';
import { FiUser, FiX, FiCheck } from 'react-icons/fi';
import { IMember, GUILD_CLASS_ICON, camelize } from '../utils';
// import { MEMBERS } from 'graphql/queries/members';
// import { initializeApollo } from '../graphql/apollo-client';

interface ClericInfoProps {
  raidId?: string; // optional for now until the cleric is attached to raid and id can be known
  cleric: Partial<IMember>;
  raidParty?: Partial<IMember>[];
  rolesRequired: string[];
  updateRaid: (key, value) => void;
}

// adding a placeholder for an avatar -- perhaps this comes from 3box?

const RaidPartyInfo: React.FC<ClericInfoProps> = ({
  raidId,
  cleric,
  raidParty,
  rolesRequired,
  updateRaid,
}: ClericInfoProps) => {
  const [clearRoles, setClearRoles] = useState(false);
  const [localRoles, setLocalRoles] = useState<string[]>(rolesRequired);
  const [updateCleric, setUpdateCleric] = useState(false);
  const [raiders, setRaiders] = useState<any[]>();
  const [loadingRaidersMsg, setLoadingRaidersMsg] = useState<string>('');
  const [clericToAdd, setClericToAdd] = useState<string>();
  const toast = useToast();

  const removeLocalRole = (role) => {
    setLocalRoles(localRoles.filter((r) => r !== role));
  };

  const clearRoleClick = () => {
    if (clearRoles) {
      setClearRoles(false);
      setLocalRoles(rolesRequired);
    } else {
      setClearRoles(true);
    }
  };

  const submitUpdatedRoles = async () => {
    // if (rolesRequired !== localRoles) {
    //   const result = await updateRecord('raid', raidId, {
    //     roles_required: localRoles,
    //   });
    //   if ('roles_required' in result) {
    //     setClearRoles(false);
    //     setLocalRoles(result.roles_required);
    //   }
    // } else {
    //   setClearRoles(false);
    // }
  };

  const submitUpdatedCleric = async () => {
    // const result = await updateRecord('raid', raidId, { cleric: clericToAdd });
    // if ('cleric' in result) {
    //   toast({
    //     title: 'Cleric Updated',
    //     status: 'success',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   updateRaid('cleric', clericToAdd);
    // }
  };

  const submitClearCleric = async () => {
    // const result = await updateRecord('raid', raidId, { cleric: '' });
    // if (result !== undefined && 'cleric' in result) {
    //   toast({
    //     title: 'Cleric Cleared',
    //     status: 'success',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   updateRaid('cleric', clericToAdd);
    //   setUpdateCleric(true);
    // }
  };

  // useEffect(() => {
  //   // TODO clear async
  //   const apolloClient = initializeApollo();
  //   setLoadingRaidersMsg('Loading Raiders...');
  //   const fetchRaiders = async () => {
  //     const result = await apolloClient.query({ query: MEMBERS });
  //     const localMembers = camelize(result.data.members);
  //     setRaiders(localMembers);
  //     setClericToAdd(localMembers[0]?.id);
  //     setLoadingRaidersMsg('');
  //   };
  //   if (updateCleric && (!raiders || raiders?.length === 0)) {
  //     fetchRaiders();
  //   }
  // }, [updateCleric, raiders]);

  return (
    <Stack p={4}>
      <Flex direction="column" py={2}>
        <Text color="raid" fontSize="sm" paddingLeft={1} paddingBottom={1}>
          Cleric
        </Text>

        {cleric ? (
          <HStack justifyContent="space-between">
            <Link href="/members/[id]" as={`/members/${cleric.id}/`}>
              <HStack
                spacing={4}
                width="60%"
                _hover={{ cursor: 'pointer', color: 'red.100' }}
              >
                <Avatar
                  backgroundColor="gray.500"
                  size="md"
                  icon={
                    <Icon
                      as={FiUser}
                      fontSize="1.5rem"
                      color="whiteAlpha.800"
                    />
                  }
                />
                <Text
                  color="white"
                  fontSize="md"
                  transition="all ease-in-out 0.25"
                >
                  {cleric.name}
                </Text>
              </HStack>
            </Link>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={submitClearCleric}
            >
              Change Cleric
            </Button>
          </HStack>
        ) : (
          <HStack justifyContent="space-between">
            {updateCleric ? (
              <HStack w="100%">
                <IconButton
                  variant="outline"
                  icon={<Icon as={FiX} color="raid" />}
                  aria-label="Clear Set Raider for Raid"
                  onClick={() => setUpdateCleric(false)}
                />
                {raiders?.length > 0 ? (
                  <Select onChange={(e) => setClericToAdd(e.target.value)}>
                    {raiders?.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.ensName || c.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Box>{loadingRaidersMsg}</Box>
                )}

                <Button onClick={submitUpdatedCleric}>Add</Button>
              </HStack>
            ) : (
              <Flex justify="space-between" w="100%" align="center">
                <Text px={2}>Unclaimed</Text>
                <Button
                  variant="outline"
                  color="raid"
                  borderColor="raid"
                  onClick={() => setUpdateCleric(true)}
                >
                  Claim
                </Button>
              </Flex>
            )}
          </HStack>
        )}
      </Flex>
      {raidParty?.length > 0 && (
        <Stack spacing={4}>
          <Box>
            <Box
              borderBottomColor="whiteAlpha.400"
              borderBottomStyle="solid"
              borderBottomWidth="1px"
              mb={2}
            />
            <Text color="raid" fontSize="sm" paddingLeft={1} paddingBottom={1}>
              Raiders
            </Text>
          </Box>
          {raidParty.map((member: Partial<IMember>) => (
            <Flex key={member.id} justify="space-between" align="center">
              <Link href="/members/[id]" as={`/members/${member.id}/`}>
                <HStack
                  spacing={4}
                  width="60%"
                  _hover={{ cursor: 'pointer', color: 'red.100' }}
                  transition="all ease-in-out 0.25"
                >
                  {/* <Avatar
                    backgroundColor="gray.500"
                    size="md"
                    src={
                      guildClassMap.find(
                        (item) => item.guildClass === member.guildClass
                      )?.image
                    }
                  /> */}
                  <Flex direction="column">
                    <Text color="white" fontSize="md">
                      {member.name}
                    </Text>
                    <Text color="raid" fontSize="sm">
                      {member.guildClass}
                    </Text>
                  </Flex>
                </HStack>
              </Link>
              <IconButton
                icon={<Icon as={FiX} color="raid" fontSize="1.5rem" />}
                aria-label="Remove Raider"
                variant="outline"
                isDisabled
              />
            </Flex>
          ))}
        </Stack>
      )}
      {rolesRequired?.length > 0 && (
        <Stack spacing={2}>
          <Box
            borderBottomColor="whiteAlpha.400"
            borderBottomStyle="solid"
            borderBottomWidth="1px"
          />
          <Text color="raid" fontSize="sm" paddingLeft={1} paddingBottom={1}>
            Recruiting
          </Text>
          <Flex justify="space-between">
            <Wrap>
              {localRoles.map((role) => (
                <WrapItem mx={4} key={role}>
                  <Tooltip label={role}>
                    {/* <Avatar
                      backgroundColor="gray.500"
                      size="md"
                      src={
                        guildClassMap.find((item) => item.guildClass === role)
                          ?.image
                      }
                      position="relative"
                    >
                      {clearRoles && (
                        <Icon
                          as={FiX}
                          bg="raid"
                          color="white"
                          position="absolute"
                          borderRadius={10}
                          top="-2"
                          right="-2"
                          aria-label={`Remove ${role} role`}
                          _hover={{ cursor: 'pointer' }}
                          onClick={() => removeLocalRole(role)}
                        />
                      )}
                    </Avatar> */}
                  </Tooltip>
                </WrapItem>
              ))}
            </Wrap>
            <HStack>
              <IconButton
                variant="outline"
                icon={<Icon as={FiX} color="raid" fontSize="1.5rem" />}
                aria-label="Clear Roles Required"
                onClick={clearRoleClick}
              />
              {clearRoles && (
                <IconButton
                  variant="solid"
                  icon={<Icon as={FiCheck} color="raid" fontSize="1.5rem" />}
                  aria-label="Save updated roles"
                  onClick={submitUpdatedRoles}
                />
              )}
            </HStack>
          </Flex>
        </Stack>
      )}
    </Stack>
  );
};

export default RaidPartyInfo;
