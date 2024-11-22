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
  truncateEmail,
} from '@raidguild/dm-utils';
import { format } from 'date-fns';
import _ from 'lodash';
import { useState } from 'react';

import Description from './Description';
import InfoStack from './InfoStack';

interface RaidProps {
  raid?: IRaid;
  consultation?: IConsultation;
}

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

const RaidDetailsCard = ({ raid, consultation }: RaidProps) => {
  const consultationContacts = _.map(
    consultation?.consultationsContacts,
    (contact, index) => {
      const name = _.get(contact, 'contact.name');
      const email = _.get(contact, 'contact.contactInfo.email');
      const discord = _.get(contact, 'contact.contactInfo.discord');
      const telegram = _.get(contact, 'contact.contactInfo.telegram');
      const bio = _.get(contact, 'contact.bio');

      return {
        title: `Client Point of Contact${
          Array.from([consultation?.consultationsContacts]).length > 0
            ? ` #${index + 1}`
            : ''
        }`,
        items: _.compact([
          name && { label: 'Name', details: `${name}` },
          email && {
            label: 'Email',
            details: `${truncateEmail(email)}`,
            fullDetails: email,
            link: `mailto:${email}`,
          },
          discord && { label: 'Discord', details: `${discord}` },
          telegram && { label: 'Telegram', details: `${telegram}` },
        ]),
        extra: bio && <Bio bio={bio} />,
      };
    }
  );

  const portfolioItems = _.compact(
    (raid?.portfolios || []).map((portfolio) => {
      const approach = _.join(_.get(portfolio, 'approach.content'), '\n');
      const challenge = _.join(_.get(portfolio, 'challenge.content'), '\n');
      const description = _.get(portfolio, 'description');
      const projectResult = _.join(_.get(portfolio, 'result.content'), '\n');
      const category = {
        label: 'Category',
        details: _.get(portfolio, 'category'),
      };
      const repoLink = {
        label: 'Repo Link',
        details: 'Github',
        link: _.get(portfolio, 'repoLink'),
      };
      const resultLink = {
        label: 'Result Link',
        details: 'View Result',
        link: _.get(portfolio, 'resultLink'),
      };
      const slug = {
        label: 'Slug',
        details: _.get(portfolio, 'slug'),
        link: `https://raidguild.org/portfolio/${_.get(portfolio, 'slug')}`,
      };

      const imageItem = String(_.get(portfolio, 'imageUrl')).startsWith('/')
        ? `https://raidguild.org${_.get(portfolio, 'imageUrl')}`
        : _.get(portfolio, 'imageUrl');

      const imageUrl = {
        label: 'Image',
        details: 'View Image',
        link: imageItem,
      };

      return {
        title: `Portfolio - ${slug.details}`,
        items: _.compact([category, slug, repoLink, resultLink, imageUrl]),
        extra: (
          <Stack>
            <Description
              description={description || 'There is no project description.'}
              label='What We Did'
              startingHeight={25}
            />
            <Description
              description={challenge || 'There is no challenge description.'}
              label='The Challenge'
              startingHeight={25}
            />
            <Description
              description={approach || 'There is no approach description.'}
              label='Our Approach'
              startingHeight={25}
            />
            <Description
              description={projectResult || 'There is no result description.'}
              label='Result'
              startingHeight={25}
            />
          </Stack>
        ),
      };
    })
  );

  const keyLinkItems = _.compact([
    // AVAILABLE_PROJECT_SPECS_DISPLAY is not a required field on the
    // consultation form, so we handle edge cases here.
    // Logic below should be simplified if it ever becomes a required field.

    ...(consultation?.links?.length > 0
      ? consultation.links
          .map((linkItem) => ({
            label: _.startCase(_.toLower(String(linkItem?.type))),
            details: _.truncate(linkItem.link, { length: 18 }),
            link: linkItem.link,
          }))
          .filter((x) => x.link)
      : [
          {
            label: 'Specification',
            details: consultation?.link ? 'Link' : undefined,
            link: consultation?.link || undefined,
          },
        ]),
    _.get(consultation, 'consultationHash') && {
      label: 'Consultation Hash',
      details:
        _.get(consultation, 'consultationHash') === 'cancelled'
          ? _.get(consultation, 'consultationHash')
          : truncateAddress(_.get(consultation, 'consultationHash')),
      link:
        _.get(consultation, 'consultationHash') !== 'cancelled' &&
        `https://gnosisscan.io/tx/${_.get(consultation, 'consultationHash')}`,
    },
  ]);

  const panels = [
    {
      title: 'Project Details',
      items: _.compact([
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
      ]),
      extra: (
        <Description
          description={_.get(consultation, 'description')}
          startingHeight={25}
        />
      ),
    },
    {
      title: 'Key Links',
      items: keyLinkItems,
    },
    ...consultationContacts,
    {
      title: 'Additional Info',
      items: _.compact([
        // ? do we need to show airtable ID here?
        (_.get(raid, 'v1Id') || // _.get(raid, 'airtableId') ||
          _.get(raid, 'id')) && {
          label: 'Raid ID',
          details:
            _.get(raid, 'v1Id') || // _.get(raid, 'airtableId') ||
            _.get(raid, 'id'),
          copy: true,
        },
        _.get(raid, 'escrowIndex') && {
          label: 'Escrow Index',
          details: _.get(raid, 'escrowIndex'),
        },
        _.get(raid, 'lockerHash') && {
          label: 'Locker Hash',
          details: truncateAddress(_.get(raid, 'lockerHash')),
          link: `https://gnosisscan.com/tx/${_.get(raid, 'lockerHash')}`,
        },
        {
          label: 'Escrow',
          details: _.get(raid, 'invoice.invoiceAddress')
            ? truncateAddress(_.get(raid, 'invoice.invoiceAddress'))
            : 'Create Escrow',
          fullDetails: _.get(raid, 'invoice.invoiceAddress')
            ? _.get(raid, 'invoice.invoiceAddress')
            : undefined,
          link: _.get(raid, 'invoice.invoiceAddress')
            ? `/escrow/${raid?.id}`
            : `/escrow/new${raid?.id ? `?raidId=${raid?.id}` : ''}`,
        },
      ]),
    },
    ...portfolioItems,
  ];

  return (
    <Card variant='filled' padding={2} w='100%'>
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
                        fullDetails={_.get(item, 'fullDetails')}
                        link={_.get(item, 'link')}
                        copy={_.get(item, 'copy')}
                        key={`${_.get(item, 'label')}-${_.get(
                          item,
                          'details'
                        )}`}
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
