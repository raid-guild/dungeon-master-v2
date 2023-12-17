import { Link, Tooltip } from '@raidguild/design-system';
import React from 'react';
import { CgExternal } from 'react-icons/cg';

interface LinkExternalProps {
  href: string;
  label: string;
}

const LinkExternal: React.FC<LinkExternalProps> = ({ href, label }) => (
  <Link
    href={href ?? '#'}
    display='flex'
    alignItems='center'
    flexDir='row'
    fontFamily='mono'
    textColor={href ? 'purple.300' : 'gray.600'}
    _hover={{ textDecor: href ?? 'underline' }}
    
  >
    <Tooltip label={href ?? 'Disabled'} placement='top'>
    {label}
    </Tooltip>
    <CgExternal />
  </Link>
);

export default LinkExternal;
