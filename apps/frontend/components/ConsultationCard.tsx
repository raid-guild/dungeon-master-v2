import React from 'react';
import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  Badge,
  Icon,
  Tooltip,
  SimpleGrid,
  VStack,
  UnorderedList,
  ListItem,
} from '@raidguild/design-system';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import Link from 'next/link';
import { format } from 'date-fns';
import RaidInfoStack from './RaidInfoStack';

interface ConsultationProps {
  id: string;
  name: string;
  description: string;
  budget: string;
  submissionDate: string;
  submissionType: string;
  projectType: string;
  servicesRequired: string[];
}

const ConsultationCard: React.FC<ConsultationProps> = ({
  id,
  name = 'Dungeon Master v1',
  submissionDate,
  description,
  budget,
  submissionType,
  projectType,
  servicesRequired,
}: ConsultationProps) => {
  return (
    <Flex
      direction="column"
      width="100%"
      minWidth="60vw"
      justifyContent="center"
      padding={8}
      bg="gray.800"
      rounded="md"
    >
      <Flex
        direction="row"
        width="100%"
        alignItems="space-apart"
        justifyContent="space-between"
      >
        <HStack spacing={4} align="center">
          <Link href="/consultations/[id]" as={`/consultations/${id}/`}>
            <Heading
              color="white"
              as="h3"
              fontSize="2xl"
              transition="all ease-in-out .25s"
              _hover={{ cursor: 'pointer', color: 'red.100' }}
            >
              {name}
            </Heading>
          </Link>
          {submissionType === 'Paid' && (
            <Tooltip label="Paid Submission" placement="right" hasArrow>
              <span>
                <Icon as={AiOutlineDollarCircle} w={6} h={6} color="raid" />
              </span>
            </Tooltip>
          )}
          <Badge colorScheme="red">Pending Consultation</Badge>
        </HStack>
        <Link href="/consultations/[id]" as={`/consultations/${id}/`}>
          <Button color="raid" borderColor="raid" variant="outline">
            View Details
          </Button>
        </Link>
      </Flex>
      <Flex
        direction="row"
        width="80%"
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
          <HStack>
            <Text color="gray.100" fontSize="smaller">
              Submitted
            </Text>
            <Text color="gray.100" fontSize="smaller">
              {submissionDate && format(new Date(+submissionDate), 'Pp')}
            </Text>
          </HStack>
          <Text color="white">
            {description?.length > 300
              ? `${description?.slice(0, 300)}...`
              : description}
          </Text>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="space-between"
        maxWidth="80%"
        paddingY={4}
      >
        <SimpleGrid columns={3} spacing={4} width="100%">
          <RaidInfoStack label="Budget" details={budget || '-'} />
          <RaidInfoStack label="Project Type" details={projectType || '-'} />
        </SimpleGrid>
      </Flex>
      {servicesRequired?.length > 0 && (
        <VStack align="flex-start">
          <Text color="white" fontSize="sm">
            Services Required
          </Text>
          <UnorderedList paddingLeft={4}>
            {servicesRequired?.map((service) => (
              <ListItem color="gray.100" key={service}>
                {service}
              </ListItem>
            ))}
          </UnorderedList>
        </VStack>
      )}
    </Flex>
  );
};

export default ConsultationCard;
