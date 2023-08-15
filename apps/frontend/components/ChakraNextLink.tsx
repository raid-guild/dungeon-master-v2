/* eslint-disable react/jsx-props-no-spreading */
import NextLink from 'next/link';

const ChakraNextLink = ({ href, children, ...props }) => (
  <NextLink href={href} {...props} passHref>
    {children}
  </NextLink>
);

export default ChakraNextLink;
