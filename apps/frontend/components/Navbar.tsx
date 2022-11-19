import _ from 'lodash';
import { Flex, Heading, HStack } from '@raidguild/design-system';
import Link from './ChakraNextLink';
import ConnectWallet from './ConnectWallet';

const links = [
  { href: '/raids', label: 'Raids' },
  { href: '/consultations', label: 'Consultations' },
  { href: '/members', label: 'Members' },
  { href: '/applications', label: 'Applications' },
];

const Navbar = () => (
  <Flex justify="space-between" p={8}>
    <HStack spacing={10}>
      <Link href="/">
        <Heading>🏰</Heading>
      </Link>
      <HStack align="center" spacing={4}>
        {_.map(links, ({ href, label }) => (
          <Link key={href} href={href}>
            <Heading size="sm">{label}</Heading>
          </Link>
        ))}
      </HStack>
    </HStack>
    <ConnectWallet />
  </Flex>
);

export default Navbar;
