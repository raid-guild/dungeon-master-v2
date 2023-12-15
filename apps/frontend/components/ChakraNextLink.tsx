/* eslint-disable react/jsx-props-no-spreading */
import { ChakraLinkProps, Link as ChakraLink } from '@raidguild/design-system';
import NextLink from 'next/link';

const ChakraNextLink = ({ href, children, ...props }: ChakraLinkProps) => (
  <ChakraLink as={NextLink} href={href} {...props} passHref>
    {children}
  </ChakraLink>
);

export default ChakraNextLink;
