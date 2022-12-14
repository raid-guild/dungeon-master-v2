import _ from 'lodash';
import { ReactNode, useState } from 'react';
import {
  Flex,
  HStack,
  Text,
  RoleBadge,
  IconButton,
  Icon,
  Avatar,
  AvatarGroup,
  ChakraSelect,
  Button,
  Box,
} from '@raidguild/design-system';
import { FiX } from 'react-icons/fi';
import { HiSwitchVertical } from 'react-icons/hi';
import ChakraNextLink from '../ChakraNextLink';
import {
  GUILD_CLASS_ICON,
  GUILD_CLASS_DISPLAY,
  IMember,
  memberDisplayName,
} from '../../utils';
import MemberAvatar from '../MemberAvatar';

type RaidPartyCardProps = {
  /*
  | needed for raider
  */
  member?: Partial<IMember>;
  /*
  | needed for cleric
  */
  members?: Partial<IMember>[];
  /*
  | needed for roles
  */
  roles?: string[];
  isCleric?: boolean;
  isRole?: boolean;
};

type GeneralCardProps = {
  button?: ReactNode;
  children: ReactNode;
};

const RaidPartyCard = ({
  member,
  members,
  roles,
  isCleric,
  isRole,
}: RaidPartyCardProps) => {
  const [updateCleric, setUpdateCleric] = useState(false);

  const GeneralCard = ({ button, children }: GeneralCardProps) => (
    <Flex
      key={_.get(member, 'id', 'roles')}
      justify="space-between"
      align="center"
    >
      {(isCleric && (!member || updateCleric)) || isRole ? (
        <>
          {children}

          <Box ml={2}>{button}</Box>
        </>
      ) : (
        <>
          <ChakraNextLink href={`/members/${member.ethAddress}/`}>
            {children}
          </ChakraNextLink>
          {button}
        </>
      )}
    </Flex>
  );

  if (member && isCleric) {
    return (
      <GeneralCard
        button={
          <IconButton
            icon={
              <Icon
                as={HiSwitchVertical}
                color="whiteAlpha.600"
                fontSize="1.5rem"
              />
            }
            aria-label="Switch Cleric"
            variant="outline"
          />
        }
      >
        <HStack
          spacing={4}
          _hover={{ cursor: 'pointer', color: 'red.100' }}
          transition="all ease-in-out 0.25"
        >
          {member && <MemberAvatar member={member} />}

          <Flex direction="column">
            <Text as="span" color="white" fontSize="md">
              {_.get(member, 'name')}
            </Text>
            <Text color="primary.500" fontSize="sm">
              {GUILD_CLASS_DISPLAY[_.get(member, 'guildClass.guildClass')]}
            </Text>
          </Flex>
        </HStack>
      </GeneralCard>
    );
  }

  if (!member && isCleric) {
    return (
      <GeneralCard
        button={
          updateCleric ? (
            <Button>Add</Button>
          ) : (
            <Button variant="outline" onClick={() => setUpdateCleric(true)}>
              Claim
            </Button>
          )
        }
      >
        <Flex>
          {updateCleric ? (
            <HStack w="100%">
              <IconButton
                variant="outline"
                icon={<Icon as={FiX} color="primary.300" />}
                aria-label="Clear Set Raider for Raid"
                onClick={() => setUpdateCleric(false)}
              />
              {!_.isEmpty(members) && (
                <ChakraSelect>
                  {_.map(members, (m: Partial<IMember>) => (
                    <option value={m.id} key={m.id}>
                      {memberDisplayName(m)}
                    </option>
                  ))}
                </ChakraSelect>
              )}
            </HStack>
          ) : (
            <Flex justify="space-between" w="100%" align="center">
              <Text px={2}>Unclaimed</Text>
            </Flex>
          )}
        </Flex>
      </GeneralCard>
    );
  }

  if (isRole) {
    return (
      <GeneralCard
        button={
          <IconButton
            variant="outline"
            icon={<Icon as={FiX} color="primary.500" fontSize="1.5rem" />}
            aria-label="Remove roles"
          />
        }
      >
        <AvatarGroup>
          {_.map(roles, (role: string) => (
            <Avatar
              key={role}
              icon={
                <RoleBadge
                  roleName={GUILD_CLASS_ICON[role]}
                  width="44px"
                  height="44px"
                  border="2px solid"
                />
              }
            />
          ))}
        </AvatarGroup>
      </GeneralCard>
    );
  }

  // * Remove role icon
  // <Icon
  //     as={FiX}
  //     bg="raid"
  //     color="white"
  //     position="absolute"
  //     borderRadius={10}
  //     top="-2"
  //     right="-2"
  //     aria-label={`Remove ${role} role`}
  //     _hover={{ cursor: 'pointer' }}
  //     // onClick={() => removeLocalRole(role)}
  //   />

  // DEFAULT OPTION IS RAIDER CARD
  return (
    <GeneralCard
      button={
        <IconButton
          icon={<Icon as={FiX} color="primary.500" fontSize="1.5rem" />}
          aria-label="Remove Raider"
          variant="outline"
          isDisabled
        />
      }
    >
      <HStack
        spacing={4}
        _hover={{ cursor: 'pointer', color: 'red.100' }}
        transition="all ease-in-out 0.25"
      >
        {member && <MemberAvatar member={member} />}

        <Flex direction="column">
          <Text as="span" color="white" fontSize="md">
            {_.get(member, 'name')}
          </Text>
          <Text color="primary.500" fontSize="sm">
            {GUILD_CLASS_DISPLAY[_.get(member, 'guildClass.guildClass')]}
          </Text>
        </Flex>
      </HStack>
    </GeneralCard>
  );
};

export default RaidPartyCard;
