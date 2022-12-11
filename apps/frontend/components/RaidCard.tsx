import React from 'react';
import _ from 'lodash';
import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  VStack,
  Badge,
  Icon,
  Tooltip,
  SimpleGrid,
  UnorderedList,
  ListItem,
  Card,
  AvatarGroup,
  RoleBadge,
  Avatar
} from '@raidguild/design-system';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import Link from './ChakraNextLink';
// import { format } from 'date-fns';
import InfoStack from './InfoStack';
import { IConsultation, IRaid } from '../utils';
import { PROJECT_TYPE_DISPLAY, RAID_CATEGORY_DISPLAY, BUDGET_DISPLAY, GUILD_CLASS_ICON, SKILLS_DISPLAY } from '../utils/constants';

interface RaidProps {
  raid?: IRaid;
  consultation: IConsultation;
}

const RaidCard: React.FC<RaidProps> = ({ raid, consultation }: RaidProps) => {
  const servicesRequired = _.get(consultation, 'consultationsServicesReqs');
  const uniqueServicesRequired = _.uniq(
    _.map(servicesRequired, (service: { guildService: string }) =>
      _.get(service, 'guildService')
    )
  );
  const id = _.get(raid || consultation, 'id');
  const submissionType = _.get(consultation, 'submissionType');
  const description = _.get(consultation, 'projectDesc');
  const budget = BUDGET_DISPLAY[_.get(consultation, 'budget')];
  const projectType = PROJECT_TYPE_DISPLAY[_.get(consultation, 'projectType')];
  const raidCategory = RAID_CATEGORY_DISPLAY[_.get(raid, 'category', '-')];
  const rolesRequired = _.map(_.get(raid, 'rolesRequired', []), 'role');

  // TODO handle links for consulation/raid
  const link = raid ? `/raids/${id}/` : `/consultations/${id}/`;
  console.log(`raid: ${JSON.stringify(raid)}`)
  const raidParty = _.map(_.get(raid, 'raidParty', []), 'memberByMember.guildClass');
  const raidCleric = _.get(raid, 'memberByCleric.name', 'na');

  // roles required
  console.log(`rolesRequired: ${rolesRequired.length} ${JSON.stringify(rolesRequired)}`);

  console.log(`memberByCleric: ${JSON.stringify(raidCleric)}`);
  

  return (
    <Card variant="withHeader">
      <Flex
        direction="row"
        width="90%"
        mx="auto"
        alignItems="space-apart"
        justifyContent="space-between"
      >
        <HStack spacing={4} align="center">
          <Link href={link}>
            <Heading
              color="white"
              as="h3"
              fontSize="2xl"
              transition="all ease-in-out .25s"
              _hover={{ cursor: 'pointer', color: 'red.100' }}
            >
              {_.get(raid, 'name', _.get(consultation, 'projectName'))}
            </Heading>
          </Link>
          {submissionType === 'Paid' && (
            <Tooltip label="Paid Submission" placement="right" hasArrow>
              <span>
                <Icon as={AiOutlineDollarCircle} w={6} h={6} color="raid" />
              </span>
            </Tooltip>
          )}
          <Badge colorScheme="green">
            {_.get(raid, 'status', _.get(consultation, 'status'))}
          </Badge>
        </HStack>
        <HStack>
          <VStack>
            <Text>Cleric</Text>
            <Text>{raidCleric}</Text>
          </VStack>
          <Text>Roles Required</Text>
          <AvatarGroup>
            {_.map(rolesRequired, (role: string) => (
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
        </HStack>
          {/* display cleric */}
        <Link href={link}>
          <Button color="raid" borderColor="raid" variant="outline">
            View Details
          </Button>
        </Link>
      </Flex>
      <Flex
        direction="row"
        width="90%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          direction="column"
          width="100%"
          alignItems="flex-start"
          justifyContent="space-between"
          maxWidth="80%"
          paddingY={4}
        >
          {_.get(raid, 'createdAt') && (
            <HStack>
              {/* todo: 
              - Raid Created Date
                  - if status = Awaiting | Preparing
              - Raid Started Date
                  - if status = Raiding
              - Raid Ended Date
                  - if status = Shipped | Lost
              */}
              <Text color="gray.100" fontSize="smaller">
                Raid Started
              </Text>
              <Text color="gray.100" fontSize="smaller">
                {_.get(raid, 'createdAt')}
                {/* {createdAt && format(new Date(+createdAt), 'Pp')} */}
              </Text>
            </HStack>
          )}
          <Text color="white">
            {_.gt(_.size(description), 300)
              ? `${description?.slice(0, 300)}...`
              : description}
          </Text>
        </Flex>
        <Flex direction="column">
          <Text color="gray.100" fontSize="smaller">
            Raid Party
          </Text>

          <AvatarGroup>
            {_.map(raidParty, (role: string) => (
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
        </Flex>
      </Flex>
      <Flex
        direction="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="space-between"
        maxWidth="90%"
        paddingY={4}
      >
        <SimpleGrid columns={3} spacing={4} width="100%">
          <InfoStack label="Budget" details={budget || '-'} />
          <InfoStack label="Category" details={raidCategory} />
          <InfoStack label="Project Type" details={projectType || '-'} />
        </SimpleGrid>
          {rolesRequired?.length > 0 && (
            <VStack align="start">
              <Text as="span" color="gray.100" fontSize="small">
                Roles Needed
              </Text>
              <HStack>
                {rolesRequired?.map((role) => (
                  <Text color="gray.100" key={role}>
                    {SKILLS_DISPLAY(role)}
                  </Text>
                ))}
              </HStack>
            </VStack>
          )}
          {/* display comment  */}
          <Flex direction="column">
                {/* todo: display first comment, truncated, with careted date. Display full text inside tooltip */}
          </Flex>
      </Flex>
    </Card>
  );
};

export default RaidCard;
