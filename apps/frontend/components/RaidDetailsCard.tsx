import React, { useState } from 'react';
import _ from 'lodash';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Grid,
  Button,
  Text,
  VStack,
  Stack,
  Heading,
} from '@raidguild/design-system';
import { Collapse } from '@chakra-ui/react';
import { format } from 'date-fns';
import { IConsultation, BUDGET_DISPLAY, truncateAddress } from '../utils';
import RaidInfoStack from './RaidInfoStack';

interface RaidProps {
  id: string;
  category?: string;
  airtableId?: string;
  escrowIndex?: string;
  lockerHash?: string;
  consultation?: IConsultation;
}

const Description = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const handleToggleDesc = () => setShowFullDescription(!showFullDescription);

  return (
    <VStack align="flex-start">
      <Collapse startingHeight={25} in={showFullDescription}>
        <Text color="white" fontSize="md">
          {description !== null
            ? description
            : 'There is no project description.'}
        </Text>
      </Collapse>
      <Button
        onClick={handleToggleDesc}
        color="gray.400"
        size="sm"
        fontWeight="normal"
        variant="link"
      >
        {showFullDescription === true ? 'Show Less' : 'Show More'}
      </Button>
    </VStack>
  );
};

const Bio = ({ bio }: { bio: string }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const handleToggleBio = () => setShowFullBio(!showFullBio);

  return (
    <VStack align="flex-start">
      <Text color="white" fontSize="sm">
        Bio
      </Text>
      {bio?.length > 300 ? (
        <>
          <Collapse startingHeight={50} in={showFullBio}>
            <Text color="white" fontSize="md">
              {bio}
            </Text>
          </Collapse>
          <Button
            onClick={handleToggleBio}
            color="gray.400"
            size="sm"
            fontWeight="normal"
            variant="link"
          >
            {showFullBio === true ? 'Show Less' : 'Show More'}
          </Button>
        </>
      ) : (
        <Text color="white" fontSize="md">
          {bio}
        </Text>
      )}
    </VStack>
  );
};

const RaidDetailsCard: React.FC<RaidProps> = ({
  id,
  category,
  airtableId,
  escrowIndex,
  lockerHash,
  consultation,
}: RaidProps) => {
  console.log(consultation);

  const keyLinkItems = [
    consultation?.specsLink && {
      label: 'Project Specs',
      link: consultation?.specsLink,
    },
    _.get(consultation, 'consultationHash') && {
      label: 'Consultation Hash',
      details: truncateAddress(_.get(consultation, 'consultationHash')),
      link: `https://etherscan.io/tx/${_.get(
        consultation,
        'consultationHash'
      )}`,
    },
  ].filter((x) => x);
  console.log(keyLinkItems);

  const panels = [
    {
      title: 'Project Details',
      items: [
        {
          label: 'Budget',
          details: BUDGET_DISPLAY[_.get(consultation, 'budget', '-')],
        },
        { label: 'Category', details: category },
        {
          label: 'Desired Delivery',
          details:
            _.get(consultation, 'desiredDelivery') &&
            format(
              new Date(_.get(consultation, 'desiredDelivery')),
              'MMM d, yyyy'
            ),
        },
        {
          label: 'Project Type',
          details: _.get(consultation, 'projectType', '-'),
        },
        { label: 'Specs', details: _.get(consultation, 'projectSpecs', '-') },
        {
          label: 'Delivery Priority',
          details: _.get(consultation, 'deliveryPriorities', '-'),
        },
      ].filter((x) => x),
      extra: <Description description={_.get(consultation, 'projectDesc')} />,
    },
    {
      title: 'Key Links',
      items: keyLinkItems,
    },
    {
      title: 'Client Point of Contact',
      items: [
        { label: 'Name', details: _.get(consultation, 'contactName', '-') },
        _.get(consultation, 'contactEmail') && {
          label: 'Email',
          details: _.get(consultation, 'contactEmail'),
          link: `mailto:${_.get(consultation, 'contactEmail')}`,
        },
        _.get(consultation, 'contactDiscord') && {
          label: 'Discord',
          details: _.get(consultation, 'contactDiscord'),
        },
        _.get(consultation, 'contactTelegram') && {
          label: 'Telegram',
          details: _.get(consultation, 'contactTelegram'),
          link: `https://t.me/${_.get(consultation, 'contactTelegram')}`,
        },
      ].filter((x) => x),
      extra: <Bio bio={_.get(consultation, 'contactBio')} />,
    },
    {
      title: 'Additional Info',
      items: [
        airtableId && { label: 'Raid ID', details: airtableId || id },
        escrowIndex && { label: 'Escrow Index', details: escrowIndex },
        lockerHash && { label: 'Locker Hash', details: lockerHash },
      ].filter((x) => x),
    },
  ];
  console.log(panels);

  return (
    <VStack
      direction="column"
      width="100%"
      minWidth="60vw"
      justifyContent="center"
      padding={8}
      bg="gray.800"
      rounded="md"
    >
      <Accordion defaultIndex={[0]} allowMultiple w="100%">
        {_.map(panels, (panel, index) => {
          if (_.isEmpty(_.get(panel, 'items'))) return null;
          return (
            <AccordionItem key={index}>
              <AccordionButton color="raid">
                <Flex justify="space-between" w="100%">
                  <Heading size="sm" as="h2">
                    {_.get(panel, 'title')}
                  </Heading>
                  <AccordionIcon />
                </Flex>
              </AccordionButton>
              <AccordionPanel paddingBottom={4}>
                <Stack spacing={5}>
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    gap={6}
                    alignItems="center"
                    justifyContent="space-between"
                    width="90%"
                    autoFlow="wrap"
                  >
                    {_.map(_.get(panel, 'items'), (item) => (
                      <RaidInfoStack
                        label={_.get(item, 'label')}
                        details={_.get(item, 'details')}
                        link={_.get(item, 'link')}
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
    </VStack>
  );
};

export default RaidDetailsCard;
