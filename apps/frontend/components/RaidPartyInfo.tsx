import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
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
  ChakraSelect,
  Heading,
  RoleBadge,
} from '@raidguild/design-system';
import { FiUser, FiX, FiCheck } from 'react-icons/fi';
import {
  IMember,
  GUILD_CLASS_ICON,
  camelize,
  IRaid,
  IConsultation,
} from '../utils';
import { useSlimMemberList } from '../hooks/useMemberList';
import ChakraNextLink from './ChakraNextLink';

interface RaidInfoProps {
  raid?: Partial<IRaid>;
  consultation?: IConsultation;
}

const RaidPartyInfo: React.FC<RaidInfoProps> = ({ raid }: RaidInfoProps) => {
  const [clearRoles, setClearRoles] = useState(false);
  const [localRoles, setLocalRoles] = useState<string[]>(
    _.get(raid, 'rolesRequired')
  );
  const [updateCleric, setUpdateCleric] = useState(false);
  const [raiders, setRaiders] = useState<any[]>();
  const [clericToAdd, setClericToAdd] = useState<string>();

  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data } = useSlimMemberList({ token });

  const cleric = _.get(raid, 'membersByCleric');
  const raidParty = _.map(_.get(raid, 'raidParties'), 'memberByMember');
  const relatedRaids = _.get(raid, 'raidByRelatedRaids');

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
        <Stack></Stack>
        <Heading size="sm">Cleric</Heading>

        {cleric ? (
          <HStack>
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
            <Button variant="outline" onClick={submitClearCleric}>
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
                {_.isEmpty(raiders) && (
                  <ChakraSelect
                    onChange={(e) => setClericToAdd(e.target.value)}
                  >
                    {_.map(raiders, (c) => (
                      <option value={c.id} key={c.id}>
                        {c.ensName || c.name}
                      </option>
                    ))}
                  </ChakraSelect>
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
      {!_.isEmpty(raidParty) && (
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
          {_.map(raidParty, (member: Partial<IMember>) => (
            <Flex key={member.id} justify="space-between" align="center">
              <ChakraNextLink href={`/members/${member.ethAddress}/`}>
                <HStack
                  spacing={4}
                  _hover={{ cursor: 'pointer', color: 'red.100' }}
                  transition="all ease-in-out 0.25"
                >
                  <RoleBadge
                    width="40px"
                    height="40px"
                    border="2px solid"
                    roleName={GUILD_CLASS_ICON[_.get(member, 'guildClass')]}
                  />
                  <Flex direction="column">
                    <Text as="span" color="white" fontSize="md">
                      {_.get(member, 'name')}
                    </Text>
                    <Text color="primary.500" fontSize="sm">
                      {_.get(member, 'guildClass')}
                    </Text>
                  </Flex>
                </HStack>
              </ChakraNextLink>
              <IconButton
                icon={<Icon as={FiX} color="primary.500" fontSize="1.5rem" />}
                aria-label="Remove Raider"
                variant="outline"
                isDisabled
              />
            </Flex>
          ))}
        </Stack>
      )}
      {!_.isEmpty(localRoles) && (
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
              {_.map(localRoles, (role) => (
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
      {_.map(relatedRaids, (raid: IRaid) => (
        <Text>Related Raid 1</Text>
      ))}
    </Stack>
  );
};

export default RaidPartyInfo;
