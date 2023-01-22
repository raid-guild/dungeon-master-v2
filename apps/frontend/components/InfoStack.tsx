/* eslint-disable no-nested-ternary */
// TODO fix ternary
import React from 'react';

import {
  Stack,
  Text,
  Link as ChakraLink,
  HStack,
  Icon,
  Tooltip,
  useClipboard,
} from '@raidguild/design-system';
import { FaExternalLinkAlt, FaInfoCircle, FaCopy } from 'react-icons/fa';
import Link from './ChakraNextLink';

interface InfoStackProps {
  label: string;
  details: string;
  link?: string;
  tooltip?: string;
  copy?: boolean;
}

const InfoStack: React.FC<InfoStackProps> = ({
  label,
  details,
  link,
  tooltip,
  copy,
}: InfoStackProps) => {
  const copyText = useClipboard(details);

  return (
    <Stack justify='center'>
      <HStack>
        <Text color='white' fontSize='sm'>
          {label}
        </Text>
        {tooltip && (
          <Tooltip label={tooltip}>
            <span>
              <Icon as={FaInfoCircle} color='whiteAlpha.400' />
            </span>
          </Tooltip>
        )}
      </HStack>

      {link ? (
        <Link href={link} isExternal>
          <HStack>
            <ChakraLink color='white' fontSize='lg' fontWeight='medium'>
              {details}
            </ChakraLink>
            <Icon as={FaExternalLinkAlt} />
          </HStack>
        </Link>
      ) : copy ? (
        <HStack>
          <Text color='white' fontSize='lg' fontWeight='medium'>
            {details}
          </Text>
          <Icon as={FaCopy} onClick={copyText.onCopy} />
        </HStack>
      ) : (
        <Text color='white' fontSize='lg' fontWeight='medium'>
          {details}
        </Text>
      )}
    </Stack>
  );
};

export default InfoStack;
