import { Link } from '@raidguild/design-system';
import React from 'react';
import { CgExternal } from 'react-icons/cg';

interface LinkExternalProps {
  href: string;
  label: string;
}

const LinkExternal: React.FC<LinkExternalProps> = ({ href, label }) => (
  <Link
    href={href}
    display='flex'
    alignItems='center'
    flexDir='row'
    fontFamily='mono'
    textColor='purple.300'
    _hover={{ textDecor: 'underline' }}
  >
    {label}
    <CgExternal />
  </Link>
);

export default LinkExternal;
