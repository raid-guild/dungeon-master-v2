import React from 'react';
import _ from 'lodash';
import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  Box,
  Icon,
  Tooltip,
  SimpleGrid,
  Stack,
  AvatarGroup,
  RoleBadge,
  Avatar,
} from '@raidguild/design-system';
import { useMediaQuery } from '@chakra-ui/react';
import MemberAvatar from './MemberAvatar';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import Link from './ChakraNextLink';
import InfoStack from './InfoStack';
import {
  PROJECT_TYPE_DISPLAY,
  RAID_CATEGORY_DISPLAY,
  BUDGET_DISPLAY,
  GUILD_CLASS_ICON,
} from '../utils/constants';
import { displayDate } from '../utils/general';
import MemberAvatarStack from './MemberAvatarStack';
import RaidStatusBadge from './RaidStatusBadge';
import { IConsultation, IRaid } from '../utils';

interface RaidProps {
  raid?: IRaid;
  consultation: IConsultation;
}

const RaidCard: React.FC<RaidProps> = ({ raid, consultation }: RaidProps) => {
  // const servicesRequired = _.get(consultation, 'consultationsServicesRequired');
  // const uniqueServicesRequired = _.uniq(
  //   _.map(servicesRequired, (service: { guildService: string }) =>
  //     _.get(service, 'guildService.guildService')
  //   )
  // );
  const id = _.get(raid || consultation, 'id');
  const submissionType = _.get(consultation, 'submissionType.submissionType');
  const description = _.get(consultation, 'description');
  const budget =
    BUDGET_DISPLAY[_.get(consultation, 'budgetOption.budgetOption')];
  const projectType = PROJECT_TYPE_DISPLAY(
    _.get(consultation, 'projectType.projectType')
  );
  const rolesRequired = _.map(_.get(raid, 'raidsRolesRequired', []), 'role');

  const link = raid ? `/raids/${id}/` : `/consultations/${id}/`;
  const raidParty = _.map(_.get(raid, 'raidParties', []), 'member');
  const raidCleric = _.get(raid, 'cleric');
  const raidStatus = _.get(raid, 'status');

  let raidDate = _.get(raid, 'createdAt');
  let raidDateLabel = 'Created on: ';
  if (raidStatus === 'RAIDING') {
    raidDate = _.get(raid, 'startDate');
    raidDateLabel = 'Started on: ';
  } else if (raidStatus === 'SHIPPED' || raidStatus === 'LOST') {
    raidDate = _.get(raid, 'endDate');
    raidDateLabel = 'Ended on: ';
  }
  const updates = _.get(raid, 'updates');
  const latestUpdate = updates ? updates[0] : null;

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <Box
      bg='gray.800'
      rounded='md'
      p={8}
      m='auto'
      w={['95%', null, null, '100%']}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        alignItems='space-apart'
        justifyContent='space-between'
      >
        <Stack spacing={4}>
          <Link href={link}>
            <Heading
              color='white'
              as='h3'
              fontSize='2xl'
              transition='all ease-in-out .25s'
              _hover={{ cursor: 'pointer', color: 'red.100' }}
            >
              {_.get(raid, 'name', _.get(consultation, 'name'))}
            </Heading>
          </Link>
          <HStack>
            <RaidStatusBadge
              status={_.get(
                raid,
                'raidStatus.raidStatus',
                _.get(consultation, 'consultationStatus.consultationStatus')
              )}
            />
            {submissionType === 'PAID' && (
              <Tooltip label='Paid Submission' placement='right' hasArrow>
                <span>
                  <Icon as={AiOutlineDollarCircle} w={6} h={6} color='white' />
                </span>
              </Tooltip>
            )}
          </HStack>
        </Stack>
        <Flex direction={{ base: 'column', md: 'row' }} align='flex-start'>
          {!_.isEmpty(rolesRequired) && (
            <HStack mb={{ base: 4, md: 0 }} mr={4}>
              <Heading size='sm' color='white'>
                Roles Required
              </Heading>
              <AvatarGroup>
                {_.map(rolesRequired, (role: string) => (
                  <Avatar
                    key={role}
                    icon={
                      <RoleBadge
                        roleName={GUILD_CLASS_ICON[role]}
                        width='44px'
                        height='44px'
                        border='2px solid'
                      />
                    }
                  />
                ))}
              </AvatarGroup>
            </HStack>
          )}

          <HStack mr={4} mb={{ base: 4, md: 0 }}>
            {raid &&
              (!raidCleric ? (
                <Heading size='sm' color='white' mr={4} mb={{ base: 4, md: 0 }}>
                  Needs Cleric!
                </Heading>
              ) : (
                <>
                  <Heading size='sm' color='white'>
                    Cleric
                  </Heading>
                  <MemberAvatar member={raidCleric} />
                </>
              ))}
          </HStack>

          <Link href={link}>
            <Button color='raid' borderColor='raid' variant='outline'>
              View Details
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Flex direction='row' justifyContent='space-between'>
        <Stack w='90%'>
          <Flex
            direction='column'
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            maxWidth='80%'
            paddingY={4}
          >
            {_.get(raid, 'createdAt') && (
              <HStack>
                <Text color='gray.100' fontSize='smaller'>
                  {raidDateLabel}
                </Text>
                <Text color='gray.100' fontSize='smaller'>
                  {displayDate(raidDate)}
                </Text>
              </HStack>
            )}
            <Text color='white'>
              {_.gt(_.size(description), 300)
                ? `${description?.slice(0, 300)}...`
                : description}
            </Text>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width='100%'>
            <InfoStack label='Budget' details={budget || '-'} />
            {_.get(raid, 'raidCategory.raidCategory') && (
              <InfoStack
                label='Category'
                details={
                  RAID_CATEGORY_DISPLAY[
                    _.get(raid, 'raidCategory.raidCategory', '-')
                  ]
                }
              />
            )}

            <InfoStack label='Project Type' details={projectType || '-'} />
          </SimpleGrid>
        </Stack>

        {!_.isEmpty(raidParty) && !upTo780 && (
          <Stack spacing={4} minW='150px' align='center'>
            <Heading size='sm' color='white'>
              Raid Party
            </Heading>

            <MemberAvatarStack members={raidParty} />
          </Stack>
        )}
      </Flex>

      {!_.isEmpty(raidParty) && upTo780 && (
        <Stack spacing={4}>
          <Heading size='sm' color='white'>
            Raid Party
          </Heading>

          <MemberAvatarStack members={raidParty} horizontal />
        </Stack>
      )}
      {latestUpdate && (
        <Flex direction='column' paddingY={4}>
          <HStack spacing={10} align='center'>
            <Heading size='sm' color='white'>
              Last Status Update
            </Heading>
            <Text>{displayDate(latestUpdate.createdAt)}</Text>
          </HStack>

          <Flex direction='column'>
            <Tooltip label={latestUpdate.update} placement='top' hasArrow>
              <span>
                <Text color='white'>
                  {_.gt(_.size(latestUpdate.update), 140)
                    ? `${latestUpdate.update?.slice(0, 140)}...`
                    : latestUpdate.update}
                </Text>
              </span>
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default RaidCard;
