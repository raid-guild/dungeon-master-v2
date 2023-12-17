/* eslint-disable no-nested-ternary */
import {
  Button,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from '@raidguild/design-system';
import _ from 'lodash';
import { ReactElement } from 'react';
import { FaCopy, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

import Link from './ChakraNextLink';

interface InfoStackProps {
  label: string;
  details: string | ReactElement | React.ReactNode;
  link?: string;
  tooltip?: string;
  copy?: boolean;
  isExternal?: boolean;
}

const InfoStack = ({
  label,
  details,
  link,
  tooltip,
  copy,
  isExternal,
}: InfoStackProps) => {
  const copyText = useClipboard(_.isString(details) ? details : '');

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

      {link ? (
        <Link href={link} isExternal={isExternal}>
          <HStack>
            {_.isString(details) ? (
              <Text color='white' fontSize='lg' fontWeight='medium' isTruncated>
                details
              </Text>
            ) : details}
            {isExternal && <Icon as={FaExternalLinkAlt} />}
          </HStack>
        </Link>
      ) : copy ? (
        <Tooltip label={`Copy ${label}`} size='sm' hasArrow>
          <Button
            variant='unstyled'
            onClick={copyText.onCopy}
            height='-webkit-fit-content'
          >
            <HStack>
              <Text color='white' fontSize='lg' fontWeight='medium' isTruncated>
                {details}
              </Text>
              <Icon as={FaCopy} />
            </HStack>
          </Button>
        </Tooltip>
      ) : (
        <Text color='white' fontSize='lg' fontWeight='medium'>
          {details}
        </Text>
      )}
    </Stack>
  );
};

export default InfoStack;
