import {
    Avatar,
  AvatarGroup,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  RoleBadge,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  Tooltip
} from '@raidguild/design-system';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import {
  BUDGET_DISPLAY,
  GUILD_CLASS_DISPLAY,
  GUILD_CLASS_ICON,
  PROJECT_TYPE_DISPLAY,
  ProjectTypeKey,
  RAID_CATEGORY_DISPLAY,
} from '@raidguild/dm-utils';
import _ from 'lodash';

import ChakraNextLink from './ChakraNextLink';
import InfoStack from './InfoStack';
import LinkExternal from './LinkExternal';
import RaidStatusBadge from './RaidStatusBadge';

type DashboardRaidCardProps = {
  consultation?: IConsultation;
  raid?: IRaid;
  newRaid?: boolean;
  noAvatar?: boolean;
  smallHeader?: boolean;
};

const DashboardRaidCard = ({
  consultation,
  raid,
  newRaid,
  noAvatar,
  smallHeader
}: DashboardRaidCardProps) => {
  const specLink =
    _.chain(consultation?.links)
      .filter(
        (x) =>
          _.get(x, 'linkType.type') === 'SPECIFICATION' && !!_.get(x, 'link')
      )
      .map((x) => _.get(x, 'link'))
      .head()
      .value() ?? consultation?.link;

  const id = _.get(raid || consultation, 'id');
  const submissionType = _.get(consultation, 'submissionType.submissionType');
  const description = _.get(consultation, 'description');
  const budget =
    BUDGET_DISPLAY[_.get(raid ? raid?.consultation : consultation, 'budgetOption.budgetOption')];

    

  const projectType = PROJECT_TYPE_DISPLAY(
    _.get(raid?.consultation || consultation, 'projectType.projectType') as ProjectTypeKey
  );
  const rolesRequired = _.map(_.get(raid, 'raidsRolesRequired', []), 'role');

  const raidContact = _.first([raid ? raid.consultation.consultationsContacts : consultation?.consultationsContacts])[0];



  return (
    <Card variant='outline' width='100%' minH='100px' >
      <Flex alignItems='center' width='100%' h='100%' >
        <ChakraNextLink
          href={
            raid
              ? `/raids/${_.get(raid, 'id')}`
              : `/consultations/${_.get(consultation, 'id')}`
          }
         

        >
          <Stack spacing={2} width='100%' gap={4}>
            <Heading color='white' size={smallHeader ? 'sm' : 'md'}>
              {_.get(raid, 'name', _.get(consultation, 'name'))}
            </Heading>
            <HStack gap={3}>
              {_.get(raid, 'raidStatus.raidStatus') && (
                <RaidStatusBadge
                  status={_.get(raid, 'raidStatus.raidStatus')}
                />
              )}
              <Box zIndex={100}>
                <LinkExternal href={specLink} label='Specs' />
              </Box>
            </HStack>
          </Stack>
        </ChakraNextLink>
        <Spacer />
        
      </Flex>
      <HStack
                
                spacing={1}
                width='100%'
                gap={14}
                

              >
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

                <InfoStack
                  label='Roles Required'
                  details={
                    !_.isEmpty(rolesRequired) ? (
                      <HStack mb={{ base: 4, md: 0 }} mr={4}>
                        <AvatarGroup>
                          {_.map(rolesRequired, (role: string) => (
                            <Box key={role}>
                              <Tooltip
                                label={GUILD_CLASS_DISPLAY[role]}
                                aria-label={GUILD_CLASS_DISPLAY[role]}
                              >
                                <Avatar
                                  bgColor='transparent'
                                  icon={
                                    <RoleBadge
                                      roleName={GUILD_CLASS_ICON[role]}
                                      width='44px'
                                      height='44px'
                                      border='2px solid'
                                    />
                                  }
                                />
                              </Tooltip>
                            </Box>
                          ))}
                        </AvatarGroup>
                      </HStack>
                    ) : (
                      '-'
                    )
                  }
                />

                <InfoStack
                  label='Submitted By'
                  details={
                    _.get(raidContact, 'contact.contactInfo.twitter') ||
                    _.get(raidContact, 'contact.contactInfo.github') ||
                    _.get(raidContact, 'contact.contactInfo.discord') ||
                    _.get(raidContact, 'contact.name') ||
                    _.get(raidContact, 'contact.contactInfo.email') ||
                    '-'
                  }
                />
                <InfoStack label='Project Type' details={projectType || '-'} />
                
              </HStack>
    </Card>
  );
};

export default DashboardRaidCard;
