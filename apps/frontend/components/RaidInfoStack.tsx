import React from 'react';
import Link from './ChakraNextLink';
import { Flex, Text, Link as ChakraLink } from '@raidguild/design-system';

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
        <Link href={link}>
          <ChakraLink color="white" fontSize="lg" fontWeight="medium">
            {details}
          </ChakraLink>
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
