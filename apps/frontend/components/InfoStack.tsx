/* eslint-disable no-nested-ternary */
import {
  Button,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  VStack} from '@raidguild/design-system';
import { truncateAddress } from '@raidguild/dm-utils';
import _, { isString } from 'lodash';
import { ReactElement } from 'react';
import { FaCopy, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

import Link from './ChakraNextLink';
import LinkExternal from './LinkExternal';
import { useRouter } from 'next/router';

interface InfoStackProps {
  label: string;
  details: string | ReactElement | React.ReactNode;
  link?: string;
  tooltip?: string;
  copy?: boolean;
  isExternal?: boolean;
  truncate?: boolean;
}

const InfoStack = ({
  label,
  details,
  link,
  tooltip,
  copy,
  isExternal,
  truncate= false
}: InfoStackProps) => {
  const copyText = useClipboard(_.isString(details) ? details : '');
  const router = useRouter()
  return (
    <Stack justify='center' minWidth='0.5' gap={0.5}>
      <HStack>
        <Text color='white' fontSize='md' textColor='primary.500'>
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
      <Text>
        {(link && isString(details) ? 
        <LinkExternal href={link} label={String(details).length > 25 ? 'Link' : details} hidden={!link} />
        :
        details
        
        ) ?? '-'}
        </Text>
    </Stack>
  );
};

export default InfoStack;
