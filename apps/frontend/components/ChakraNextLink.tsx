/* eslint-disable react/jsx-props-no-spreading */
import NextLink from 'next/link';
import { Link as ChakraLink } from '@raidguild/design-system';

const ChakraNextLink = ({ href, children, ...props }) => (
  <ChakraLink as={NextLink} href={href} {...props} passHref>
    {children}
  </ChakraLink>
);

export default ChakraNextLink;
