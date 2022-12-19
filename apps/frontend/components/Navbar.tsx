import _ from 'lodash';
import { Flex, Heading, HStack, Tooltip, Icon } from '@raidguild/design-system';
import { HiSearch } from 'react-icons/hi';
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
    <Flex align="center">
      <Flex cursor="pointer" mr={6}>
        <Tooltip label={"press CMD + K to search"} placement="bottom" hasArrow>
          <span>
           <Icon as={HiSearch} boxSize={6} />
          </span>
        </Tooltip>
      </Flex>
      <ConnectWallet />
    </Flex>
  </Flex>
);

export default Navbar;
