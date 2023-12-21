import { Link, Tooltip } from '@raidguild/design-system';
import React, { ReactElement } from 'react';
import { CgExternal } from 'react-icons/cg';

interface LinkExternalProps {
  href: string;
  label: string | ReactElement;
  hidden?: boolean;
}

const LinkExternal: React.FC<LinkExternalProps> = ({ href, label, hidden=false }) => (
  <Link
    href={href ?? '#'}
    display='flex'
    alignItems='center'
    flexDir='row'
    fontFamily='mono'
    textColor={href ? 'purple.300' : 'gray.600'}
    _hover={{ textDecor: href ?? 'underline' }}
    isExternal
    hidden={hidden}
  >
    <Tooltip label={label ?? 'Disabled'} placement='top'>
    {label}
    </Tooltip>
    <CgExternal />
  </Link>
);

export default LinkExternal;
