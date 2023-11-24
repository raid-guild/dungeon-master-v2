import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  Collapse,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  VStack,
} from '@raidguild/design-system';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import {
  AVAILABLE_PROJECT_SPECS_DISPLAY,
  AvailableSpecsKey,
  BUDGET_DISPLAY,
  DELIVERY_PRIORITIES_DISPLAY,
  PriorityKey,
  PROJECT_TYPE_DISPLAY,
  ProjectTypeKey,
  RAID_CATEGORY_DISPLAY,
  truncateAddress,
} from '@raidguild/dm-utils';
import { format } from 'date-fns';
import _ from 'lodash';
import React, { useState } from 'react';

import InfoStack from './InfoStack';

interface RaidProps {
  raid?: IRaid;
  consultation?: IConsultation;
}

const Description = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const handleToggleDesc = () => setShowFullDescription(!showFullDescription);

  return (
    <VStack align='flex-start'>
      <Collapse startingHeight={25} in={showFullDescription}>
        <Text color='white' fontSize='md'>
          {description !== null
            ? description
            : 'There is no project description.'}
        </Text>
      </Collapse>
      {description !== null && description?.length > 100 && (
        <Button
          onClick={handleToggleDesc}
          color='gray.400'
          size='sm'
          fontWeight='normal'
          variant='link'
        >
          {showFullDescription === true ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </VStack>
  );
};

const Bio = ({ bio }: { bio: string }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const handleToggleBio = () => setShowFullBio(!showFullBio);

  return (
    <VStack align='flex-start'>
      <Text color='white' fontSize='sm'>
        Bio
      </Text>
      {bio?.length > 300 ? (
        <>
          <Collapse startingHeight={50} in={showFullBio}>
            <Text color='white' fontSize='md'>
              {bio}
            </Text>
          </Collapse>
          <Button
            onClick={handleToggleBio}
            color='gray.400'
            size='sm'
            fontWeight='normal'
            variant='link'
          >
            {showFullBio === true ? 'Show Less' : 'Show More'}
          </Button>
        </>
      ) : (
        <Text color='white' fontSize='md'>
          {bio}
        </Text>
      )}
    </VStack>
  );
};

const RaidDetailsCard: React.FC<RaidProps> = ({
  raid,
  consultation,
}: RaidProps) => {
  const keyLinkItems = [
    // AVAILABLE_PROJECT_SPECS_DISPLAY is not a required field on the
    // consultation form, so we handle edge cases here.
    // Logic below should be simplified if it ever becomes a required field.
    consultation?.link
      ? {
          label: 'Project Specs',
          details: AVAILABLE_PROJECT_SPECS_DISPLAY(
            (_.get(
              consultation,
              'availableProjectSpec.availableProjectSpec'
            ) as AvailableSpecsKey) || 'YES'
          ),
          link: consultation?.link,
        }
      : {
          label: 'Project Specs',
          details: AVAILABLE_PROJECT_SPECS_DISPLAY(
            (_.get(
              consultation,
              'availableProjectSpec.availableProjectSpec'
            ) as AvailableSpecsKey) || 'NONE'
          ),
        },
    _.get(consultation, 'consultationHash') && {
      label: 'Consultation Hash',
      details:
        _.get(consultation, 'consultationHash') === 'cancelled'
          ? _.get(consultation, 'consultationHash')
          : truncateAddress(_.get(consultation, 'consultationHash')),
      link:
        _.get(consultation, 'consultationHash') !== 'cancelled' &&
        `https://etherscan.io/tx/${_.get(consultation, 'consultationHash')}`,
    },
  ].filter((x) => x);

  let smartEscrowLink;
  const createdAt = _.get(raid, 'createdAt');
  if (_.get(raid, 'invoiceAddress')) {
    // smart escrow created after August 2023 use the new split-escrow type and front end inside DM
    // url: https://dm.raidguild.org/escrow
    if (new Date(createdAt) > new Date('2023-08-01')) {
      smartEscrowLink = `/escrow/${raid.id}`;
    } else {
      // those created before use the first smart-escrow-nextjs app
      // github: https://github.com/raid-guild/smart-escrow-nextjs
      // url: https://smartescrow.raidguild.org
      smartEscrowLink = `https://smartescrow.raidguild.org/escrow/${raid.id}`;
    }
  }
  const panels = [
    {
      title: 'Project Details',
      items: [
        {
          label: 'Budget',
          details:
            BUDGET_DISPLAY[
              _.get(consultation, 'budgetOption.budgetOption', '-')
            ],
        },
        {
          label: 'Category',
          details:
            RAID_CATEGORY_DISPLAY[
              _.get(raid, 'raidCategory.raidCategory', '-')
            ],
        },
        {
          label: 'Desired Delivery',
          details:
            _.get(consultation, 'desiredDeliveryDate') &&
            format(
              new Date(_.get(consultation, 'desiredDeliveryDate')),
              'MMM d, yyyy'
            ),
        },
        {
          label: 'Project Type',
          details: PROJECT_TYPE_DISPLAY(
            _.get(
              consultation,
              'projectType.projectType',
              '-'
            ) as ProjectTypeKey
          ),
        },
        {
          label: 'Specs',
          details: AVAILABLE_PROJECT_SPECS_DISPLAY(
            _.get(
              consultation,
              'availableProjectSpec.availableProjectSpec',
              '-'
            ) as AvailableSpecsKey
          ),
        },
        {
          label: 'Delivery Priority',
          details: DELIVERY_PRIORITIES_DISPLAY(
            _.get(
              consultation,
              'deliveryPriority.deliveryPriority',
              '-'
            ) as PriorityKey
          ),
        },
      ].filter((x) => x),
      extra: <Description description={_.get(consultation, 'description')} />,
    },
    {
      title: 'Key Links',
      items: keyLinkItems,
    },
    {
      title: 'Client Point of Contact',
      items: [
        {
          label: 'Name',
          details: _.get(
            consultation,
            'consultationsContacts[0].contact.name',
            '-'
          ),
        },
        _.get(
          consultation,
          'consultationsContacts[0].contact.contactInfo.email'
        ) && {
          label: 'Email',
          details: _.get(
            consultation,
            'consultationsContacts[0].contact.contactInfo.email'
          ),
          link: `mailto:${_.get(
            consultation,
            'consultationsContacts[0].contact.contactInfo.email'
          )}`,
        },
        _.get(
          consultation,
          'consultationsContacts[0].contact.contactInfo.discord'
        ) && {
          label: 'Discord',
          details: _.get(
            consultation,
            'consultationsContacts[0].contact.contactInfo.discord'
          ),
        },
        _.get(
          consultation,
          'consultationsContacts[0].contact.contactInfo.telegram'
        ) && {
          label: 'Telegram',
          details: _.get(
            consultation,
            'consultationsContacts[0].contact.contactInfo.telegram'
          ),
          link: `https://t.me/${_.get(
            consultation,
            'consultationsContacts[0].contact.contactInfo.telegram'
          )}`,
        },
      ].filter((x) => x),
      extra: (
        <Bio
          bio={_.get(consultation, 'consultationsContacts[0].contact.bio')}
        />
      ),
    },
    {
      title: 'Additional Info',
      items: [
        (_.get(raid, 'airtableId') ||
          _.get(raid, 'v1Id') ||
          _.get(raid, 'id')) && {
          label: 'Raid ID',
          details:
            _.get(raid, 'airtableId') ||
            _.get(raid, 'v1Id') ||
            _.get(raid, 'id'),
          copy: true,
        },
        _.get(raid, 'escrowIndex') && {
          label: 'Escrow Index',
          details: _.get(raid, 'escrowIndex'),
        },
        _.get(raid, 'lockerHash') && {
          label: 'Locker Hash',
          details: _.get(raid, 'lockerHash'),
        },
        _.get(raid, 'invoiceAddress') && {
          label: 'Smart Escrow',
          details: truncateAddress(_.get(raid, 'invoiceAddress')),
          link: smartEscrowLink,
        },
      ].filter((x) => x),
    },
  ];

  return (
    <Card variant='filled' padding={2} minWidth='lg'>
      <Accordion defaultIndex={[0]} allowMultiple w='100%'>
        {_.map(panels, (panel, index) => {
          if (_.isEmpty(_.get(panel, 'items'))) return null;
          return (
            <AccordionItem key={index}>
              <AccordionButton color='raid'>
                <Flex justify='space-between' w='100%'>
                  <Heading size='sm' as='h2'>
                    {_.get(panel, 'title')}
                  </Heading>
                  <AccordionIcon />
                </Flex>
              </AccordionButton>
              <AccordionPanel paddingBottom={4}>
                <Stack spacing={5}>
                  <Grid
                    templateColumns={[
                      'repeat(2, 1fr)',
                      null,
                      null,
                      'repeat(3, 1fr)',
                    ]}
                    gap={6}
                    alignItems='flex-start'
                    justifyContent='space-between'
                    width='90%'
                    autoFlow='wrap'
                  >
                    {_.map(_.get(panel, 'items'), (item) => (
                      <InfoStack
                        label={_.get(item, 'label')}
                        details={_.get(item, 'details')}
                        link={_.get(item, 'link')}
                        copy={_.get(item, 'copy')}
                        key={_.get(item, 'label')}
                      />
                    ))}
                  </Grid>
                  {_.get(panel, 'extra')}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          );
        })}

        {/* {consultation?.servicesReq?.length > 0 && (
                <VStack align="flex-start">
                  <Text color="white" fontSize="sm">
                    Services Required
                  </Text>
                  <UnorderedList paddingLeft={4}>
                    {consultation?.servicesReq?.map((service) => (
                      <ListItem color="gray.100" key={service}>
                        {service}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </VStack>
              )} */}
      </Accordion>
    </Card>
  );
};

export default RaidDetailsCard;
