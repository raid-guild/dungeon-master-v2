import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Grid,
  Box,
  Button,
  Text,
  VStack,
  SimpleGrid,
  UnorderedList,
  ListItem,
  Link as ChakraLink,
} from '@raidguild/design-system';
import { Collapse, ExternalLinkIcon } from '@chakra-ui/icons';
import { FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { IConsultation } from '../utils';
import RaidInfoStack from './RaidInfoStack';

interface RaidProps {
  id: string;
  category?: string;
  legacy?: any;
  consultation?: IConsultation;
}

const RaidDetailsCard: React.FC<RaidProps> = ({
  id,
  category,
  legacy,
  consultation,
}: RaidProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const handleToggleDesc = () => setShowFullDescription(!showFullDescription);

  const [showFullBio, setShowFullBio] = useState(false);
  const handleToggleBio = () => setShowFullBio(!showFullBio);

  const keyLinkItems = [
    legacy?.airtableId &&
      legacy?.escrowIndex && {
        name: 'Escrow',
        href: `https://smartescrow.raidguild.org/${legacy?.airtableId}`,
      },
    consultation?.specsLink && {
      name: 'Project Specs',
      href: consultation?.specsLink,
    },
    consultation?.consultationHash && {
      name: 'Consultation Hash',
      href: `https://etherscan.io/tx/${consultation?.consultationHash}`,
    },
  ].filter((x) => x);

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
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem key={0}>
          <h2>
            <AccordionButton color="raid">
              <Box flex="1" textAlign="left" color="raid">
                Project Details
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel paddingBottom={4}>
            <VStack
              direction="row"
              width="100%"
              alignItems="space-apart"
              justifyContent="space-between"
              spacing={4}
            >
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={6}
                alignItems="center"
                justifyContent="space-between"
                width="90%"
                autoFlow="column"
              >
                <RaidInfoStack
                  label="Budget"
                  details={consultation?.budget || '-'}
                />
                <RaidInfoStack
                  label="Raid Category"
                  details={category || '-'}
                />
                <RaidInfoStack
                  label="Desired Delivery"
                  details={
                    consultation?.desiredDelivery
                      ? format(
                          new Date(+consultation?.desiredDelivery),
                          'MMM d, yyyy'
                        )
                      : '-'
                  }
                />
              </Grid>
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={6}
                alignItems="center"
                justifyContent="space-between"
                width="90%"
                autoFlow="column"
              >
                <RaidInfoStack
                  label="Project Type"
                  details={consultation?.projectType || '-'}
                />
                <RaidInfoStack
                  label="Specs"
                  details={consultation?.projectSpecs || '-'}
                />
                <RaidInfoStack
                  label="Delivery Priorities"
                  details={consultation?.deliveryPriorities || '-'}
                />
              </Grid>
              {consultation?.servicesReq?.length > 0 && (
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
              )}
              <VStack align="flex-start">
                <Collapse startingHeight={25} in={showFullDescription}>
                  <Text color="white" fontSize="md">
                    {consultation?.projectDesc !== null
                      ? consultation?.projectDesc
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
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {((legacy?.airtableId && legacy?.escrowIndex) ||
          consultation?.specsLink ||
          consultation?.consultationHash) && (
          <AccordionItem key={1}>
            <h2>
              <AccordionButton color="raid">
                <Box flex="1" textAlign="left" color="raid">
                  Key Links
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <SimpleGrid columns={3} spacing={3}>
                {keyLinkItems.map((link) => (
                  <Flex direction="row" key={link.name}>
                    <ChakraLink
                      href={link.href}
                      isExternal
                      transition="all ease-in-out .25s"
                      _hover={{ color: 'red.100' }}
                    >
                      {link.name} <ExternalLinkIcon mx="2px" />
                    </ChakraLink>
                  </Flex>
                ))}

                <Flex>
                  <Button variant="link" leftIcon={<FiPlus />} disabled>
                    Add Link
                  </Button>
                </Flex>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        )}

        <AccordionItem key={2}>
          <h2>
            <AccordionButton color="raid">
              <Box flex="1" textAlign="left" color="raid">
                Client Point of Contact
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack
              direction="row"
              width="100%"
              alignItems="space-apart"
              justifyContent="space-between"
              spacing={4}
            >
              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                w="90%"
              >
                <RaidInfoStack
                  label="Contact"
                  details={consultation?.contactName || '-'}
                />
                <RaidInfoStack
                  label="Email"
                  details={consultation?.contactEmail || '-'}
                />
                <RaidInfoStack
                  label="Discord"
                  details={consultation?.contactDiscord || '-'}
                />
                <RaidInfoStack
                  label="Telegram"
                  details={`@${consultation?.contactTelegram}` || '-'}
                  link={
                    consultation?.contactTelegram
                      ? `https://t.me/${consultation?.contactTelegram}`
                      : null
                  }
                />
              </Flex>
              <Flex w="90%">
                <VStack align="flex-start">
                  <Text color="white" fontSize="sm">
                    Bio
                  </Text>
                  {consultation?.contactBio.length > 300 ? (
                    <>
                      <Collapse startingHeight={50} in={showFullBio}>
                        <Text color="white" fontSize="md">
                          {consultation?.contactBio}
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
                      {consultation?.contactBio}
                    </Text>
                  )}
                </VStack>
              </Flex>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem key={3}>
          <h2>
            <AccordionButton color="raid">
              <Box flex="1" textAlign="left" color="raid">
                Additional Info
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="90%"
            >
              <RaidInfoStack
                label="Legacy ID"
                details={legacy?.airtableId || id || '-'}
              />
              <RaidInfoStack
                label="Escrow Index"
                details={legacy?.escrowIndex || '-'}
              />
              <RaidInfoStack
                label="Locker Hash"
                details={legacy?.lockerHash || '-'}
              />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default RaidDetailsCard;
