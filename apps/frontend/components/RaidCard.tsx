import React from 'react';
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
} from '@raidguild/design-system';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import Link from 'next/link';
import { format } from 'date-fns';
import RaidInfoStack from './RaidInfoStack';

interface RaidProps {
  id: string;
  name: string;
  status: string;
  category: string;
  description: string;
  budget: string;
  createdAt: string;
  submissionType: string;
  projectType: string;
  rolesRequired: string[];
  servicesRequired: string[];
}

const RaidCard: React.FC<RaidProps> = ({
  id,
  name = 'Dungeon Master v1.5',
  status,
  category,
  createdAt,
  description,
  budget,
  submissionType,
  projectType,
  rolesRequired = [],
  servicesRequired,
}: RaidProps) => {
  const uniqueServicesRequired = new Set(
    servicesRequired?.map((service) => service)
  );

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
          <Link href="/raids/[id]" as={`/raids/${id}/`}>
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
          <Badge colorScheme="green">{status}</Badge>
        </HStack>
        <Link href="/raids/[id]" as={`/raids/${id}/`}>
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
          {createdAt && (
            <HStack>
              <Text color="gray.100" fontSize="smaller">
                Raid Started
              </Text>
              <Text color="gray.100" fontSize="smaller">
                {createdAt && format(new Date(+createdAt), 'Pp')}
              </Text>
            </HStack>
          )}
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
          <RaidInfoStack label="Category" details={category || '-'} />
          <RaidInfoStack label="Project Type" details={projectType || '-'} />
          {rolesRequired.length > 0 && (
            <VStack align="start">
              <Text as="span" color="gray.100" fontSize="small">
                Roles Needed
              </Text>
              <HStack>
                {rolesRequired?.map((role) => (
                  <Text color="gray.100" key={role}>
                    {role}
                  </Text>
                ))}
              </HStack>
            </VStack>
          )}
          {servicesRequired?.length > 0 && (
            <VStack align="flex-start">
              <Text color="white" fontSize="sm">
                Services Required
              </Text>
              <UnorderedList paddingLeft={4}>
                {[...uniqueServicesRequired].map((service) => (
                  <ListItem color="gray.100" key={service}>
                    {service}
                  </ListItem>
                ))}
              </UnorderedList>
            </VStack>
          )}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default RaidCard;
