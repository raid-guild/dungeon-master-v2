import { Link as ChakraLink } from '@raidguild/design-system';
import NextLink from 'next/link';

const ChakraNextLink = ({ href, children, ...props }) => (
  <NextLink href={href} passHref>
    <ChakraLink {...props}>{children}</ChakraLink>
  </NextLink>
);

export default ChakraNextLink;
