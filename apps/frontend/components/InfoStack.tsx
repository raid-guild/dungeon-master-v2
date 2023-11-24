/* eslint-disable no-nested-ternary */
// TODO fix ternary
import {
  Button,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from '@raidguild/design-system';
import { FaCopy, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

import Link from './ChakraNextLink';

interface InfoStackProps {
  label: string;
  details: string;
  link?: string;
  tooltip?: string;
  copy?: boolean;
}

const InfoStack = ({ label, details, link, tooltip, copy }: InfoStackProps) => {
  const copyText = useClipboard(details);

  return (
    <Stack justify='center' minWidth='0.5'>
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
            <Text color='white' fontSize='lg' fontWeight='medium' isTruncated>
              {details}
            </Text>
            <Icon as={FaExternalLinkAlt} />
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
