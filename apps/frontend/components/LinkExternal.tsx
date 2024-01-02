import { HStack, Icon, Link, Text, Tooltip } from '@raidguild/design-system';
import React, { ReactElement } from 'react';
import { CgExternal } from 'react-icons/cg';

interface LinkExternalProps {
  href: string;
  label?: string | ReactElement;
  fullLabel?: string;
  hidden?: boolean;
}

const LinkExternal: React.FC<LinkExternalProps> = ({
  href,
  label,
  fullLabel,
  hidden = false,
}) => (
  <Tooltip label={fullLabel || label} placement='top'>
    <Link
      href={href}
      textColor={href ? 'purple.300' : 'gray.600'}
      _hover={{ textDecor: href ?? 'underline' }}
      isExternal
      hidden={hidden}
    >
      <HStack>
        <Text fontFamily='spaceMono'>{label}</Text>

        <Icon as={CgExternal} color='white' />
      </HStack>
    </Link>
  </Tooltip>
);

export default LinkExternal;
