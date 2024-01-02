/* eslint-disable no-nested-ternary */
import {
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from '@raidguild/design-system';
import _, { isString } from 'lodash';
import { ReactElement } from 'react';
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

import ChakraNextLink from './ChakraNextLink';

interface InfoStackProps {
  label: string;
  details: string | ReactElement | React.ReactNode;
  fullDetails?: string;
  link?: string;
  tooltip?: string;
  copy?: boolean;
  truncate?: boolean;
}

const InfoStack = ({
  label,
  details,
  fullDetails,
  link,
  tooltip,
  copy,
  truncate = false,
}: InfoStackProps) => {
  const copyText = useClipboard(_.isString(details) ? details : '');
  const toast = useToast();

  const handleCopy = () => {
    if (link || !isString(details)) return;

    copyText.onCopy();
    toast.info({
      title: 'Copied to clipboard!',
      // description: details,
      duration: 2000,
    });
  };

  const isExternal = link && link.startsWith('http');

  return (
    <Stack justify='center' minWidth='0.5' gap={0.5}>
      <HStack>
        <Text fontSize='xs' color='purple.200' textTransform='capitalize'>
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
      <Tooltip
        label={
          link || typeof fullDetails === 'string'
            ? fullDetails
            : typeof details === 'string'
            ? details
            : ''
        }
        shouldWrapChildren
      >
        {link && isString(details) ? (
          <ChakraNextLink href={link} hidden={!link}>
            <HStack>
              <Text fontFamily='spaceMono'>
                {details.replace(/https?:\/\//g, '')}
              </Text>
              {isExternal && (
                <Icon as={FaExternalLinkAlt} color='whiteAlpha.400' />
              )}
            </HStack>
          </ChakraNextLink>
        ) : (
          <Text
            onClick={copy && handleCopy}
            _hover={{ cursor: copy ? 'pointer' : 'default' }}
            noOfLines={1}
            fontFamily='spaceMono'
          >
            {details || '-'}
          </Text>
        )}
      </Tooltip>
    </Stack>
  );
};

export default InfoStack;
