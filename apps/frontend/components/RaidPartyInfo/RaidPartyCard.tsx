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
} from '@raidguild/design-system';
import { FiX } from 'react-icons/fi';
import ChakraNextLink from '../ChakraNextLink';
import { GUILD_CLASS_ICON, IMember } from '../../utils';

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
        children
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
          {_.get(member, 'guildClass') && (
            <RoleBadge
              width="40px"
              height="40px"
              border="2px solid"
              roleName={GUILD_CLASS_ICON[_.get(member, 'guildClass')]}
            />
          )}

          <Flex direction="column">
            <Text as="span" color="white" fontSize="md">
              {_.get(member, 'name')}
            </Text>
            <Text color="primary.500" fontSize="sm">
              {_.get(member, 'guildClass')}
            </Text>
          </Flex>
        </HStack>
      </GeneralCard>
    );
  }

  console.log(!member, isCleric);
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
              {/* {!_.isEmpty(members) && (
              <ChakraSelect onChange={(e) => setClericToAdd(e.target.value)}>
                {_.map(members, (c) => (
                  <option value={c.id} key={c.id}>
                    {c.ensName || c.name}
                  </option>
                ))}
              </ChakraSelect>
            )} */}
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
      // button={
      //   <Icon
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
      // }
      >
        <AvatarGroup spacing="10px">
          {_.map(roles, (role: string) => (
            <Avatar
              key={role}
              icon={
                <RoleBadge
                  roleName={GUILD_CLASS_ICON[role]}
                  width="50px"
                  height="50px"
                  border="2px solid"
                />
              }
            />
          ))}
        </AvatarGroup>
      </GeneralCard>
    );
  }

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
        {_.get(member, 'guildClass') && (
          <RoleBadge
            width="40px"
            height="40px"
            border="2px solid"
            roleName={GUILD_CLASS_ICON[_.get(member, 'guildClass')]}
          />
        )}

        <Flex direction="column">
          <Text as="span" color="white" fontSize="md">
            {_.get(member, 'name')}
          </Text>
          <Text color="primary.500" fontSize="sm">
            {_.get(member, 'guildClass')}
          </Text>
        </Flex>
      </HStack>
    </GeneralCard>
  );
};

export default RaidPartyCard;
