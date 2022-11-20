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
} from '@raidguild/design-system';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import Link from 'next/link';
// import { format } from 'date-fns';
import RaidInfoStack from './RaidInfoStack';
import { IRaid } from '../utils';

interface RaidProps {
  raid: IRaid;
}

const RaidCard: React.FC<RaidProps> = ({ raid }: RaidProps) => {
  const servicesRequired = _.get(
    raid,
    'consultationByConsultation.consultationsServicesReqs'
  );
  const uniqueServicesRequired = _.uniq(
    _.map(servicesRequired, (service: { guildService: string }) =>
      _.get(service, 'guildService')
    )
  );
  const id = _.get(raid, 'id');
  const submissionType = _.get(
    raid,
    'consultationByConsultation.submissionType'
  );
  const description = _.get(raid, 'consultationByConsultation.projectDesc');
  const budget = _.get(raid, 'consultationByConsultation.budget');
  const projectType = _.get(raid, 'consultationByConsultation.projectType');
  const rolesRequired = _.map(_.get(raid, 'raidsRolesRequireds'), 'role');

  return (
    <Card variant="rainbowBorder">
      <Flex
        direction="row"
        width="90%"
        mx="auto"
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
              {_.get(raid, 'name')}
            </Heading>
          </Link>
          {submissionType === 'Paid' && (
            <Tooltip label="Paid Submission" placement="right" hasArrow>
              <span>
                <Icon as={AiOutlineDollarCircle} w={6} h={6} color="raid" />
              </span>
            </Tooltip>
          )}
          <Badge colorScheme="green">{_.get(raid, 'status')}</Badge>
        </HStack>
        <Link href="/raids/[id]" as={`/raids/${id}/`}>
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
              <Text color="gray.100" fontSize="smaller">
                Raid Started
              </Text>
              <Text color="gray.100" fontSize="smaller">
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
          <RaidInfoStack label="Budget" details={budget || '-'} />
          <RaidInfoStack
            label="Category"
            details={_.get(raid, 'category', '-')}
          />
          <RaidInfoStack label="Project Type" details={projectType || '-'} />
          {rolesRequired?.length > 0 && (
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
    </Card>
  );
};

export default RaidCard;
