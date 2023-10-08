/* eslint-disable no-use-before-define */
import _ from 'lodash';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Tooltip,
  Icon,
  Stack,
  Collapse,
  useDisclosure,
  IconButton,
} from '@raidguild/design-system';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { HiSearch } from 'react-icons/hi';
import Link from './ChakraNextLink';
import ConnectWallet from './ConnectWallet';
import { useOverlay } from '../contexts/OverlayContext';
import { useSession } from 'next-auth/react';

const links = [
  { href: '/raids', label: 'Raids', role: 'member' },
  { href: '/consultations', label: 'Consultations', role: 'member' },
  { href: '/members', label: 'Members', role: 'member' },
  { href: '/applications', label: 'Applications', role: 'member' },
  { href: '/accounting', label: 'Accounting', role: 'member' },
  { href: '/escrow', label: 'Smart Escrow', role: 'client' },
];

interface NavItem {
  label: string;
  href: string;
}

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { setCommandPallet: setOpen } = useOverlay();
  const session = useSession();

  const authenticated = _.get(session, 'status') === 'authenticated';
  const role = _.get(session, 'data.user.role');

  return (
    <Box>
      <Flex justify='space-between' p={8}>
        <HStack>
          <Link href='/' mr={6}>
            <Heading>🏰</Heading>
          </Link>
          <Flex display={{ base: 'none', md: 'flex' }}>
            <DesktopNav role={role} />
          </Flex>
        </HStack>

        <Flex align='center'>
          <Flex
            cursor='pointer'
            mx={6}
            display={{ base: 'none', md: 'flex' }}
            onClick={() => setOpen(true)}
          >
            <Tooltip
              label='press CMD + K to search'
              placement='bottom'
              hasArrow
            >
              <span>
                <Icon as={HiSearch} boxSize={6} />
              </span>
            </Tooltip>
          </Flex>
          <Flex display={{ base: 'none', md: 'flex' }}>
            <ConnectWallet />
          </Flex>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <AiOutlineClose width={3} height={3} />
                ) : (
                  <GiHamburgerMenu width={5} height={5} />
                )
              }
              aria-label='Toggle Navigation'
            />
          </Flex>
        </Flex>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav role={role} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ role }: { role: string }) => (
  <HStack align='center' spacing={4}>
    {_.map(links, ({ href, label, role: linkRole }) => {
      if (!role) return null;
      if (linkRole === 'member' && role !== 'member') return null;
      // handle user?

      return (
        <Link key={href} href={href}>
          <Heading size='sm'>{label}</Heading>
        </Link>
      );
    })}
  </HStack>
);

const MobileNav = ({ role }: { role: string }) => (
  <Stack p={4} display={{ md: 'none' }}>
    {_.map(links, ({ href, label, linkRole }) => {
      if (!role) return null;
      if (linkRole === 'member' && role !== 'member') return null;
      // handle user?

      return <MobileNavItem key={href} href={href} label={label} />;
    })}
    <ConnectWallet />
  </Stack>
);

const MobileNavItem = ({ href, label }: NavItem) => (
  <Stack spacing={4}>
    <Link key={href} href={href} py={2}>
      <Heading size='sm'>{label}</Heading>
    </Link>
  </Stack>
);

export default Navbar;
