import React from 'react';
import Link from './ChakraNextLink';
import {
  Flex,
  Text,
  Link as ChakraLink,
  HStack,
  Icon,
} from '@raidguild/design-system';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface RaidInfoStackProps {
  label: string;
  details: string;
  link?: string;
}

const RaidInfoStack: React.FC<RaidInfoStackProps> = ({
  label,
  details,
  link,
}: RaidInfoStackProps) => {
  return (
    <Flex direction="column" justifyContent="center">
      <Text color="white" fontSize="sm">
        {label}
      </Text>
      {link ? (
        <Link href={link} isExternal>
          <HStack>
            <ChakraLink color="white" fontSize="lg" fontWeight="medium">
              {details}
            </ChakraLink>
            <Icon as={FaExternalLinkAlt} />
          </HStack>
        </Link>
      ) : (
        <Text color="white" fontSize="lg" fontWeight="medium">
          {details}
        </Text>
      )}
    </Flex>
  );
};

export default RaidInfoStack;
