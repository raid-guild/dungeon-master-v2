/* eslint-disable no-use-before-define */
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  useDisclosure,
} from '@raidguild/design-system';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsCaretDown } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { HiSearch } from 'react-icons/hi';

import { useOverlay } from '../contexts/OverlayContext';
import Link from './ChakraNextLink';
import ConnectWallet from './ConnectWallet';

const links = [
  { href: '/raids', label: 'Raids', role: 'member', primary: true },
  {
    href: '/consultations',
    label: 'Consultations',
    role: 'member',
    primary: true,
  },
  { href: '/rips', label: 'RIPs', role: 'member' },
  { href: '/members', label: 'Members', role: 'member' },
  { href: '/applications', label: 'Applications', role: 'member' },
  { href: '/accounting', label: 'Accounting', role: 'member' },
  { href: '/escrow', label: 'Escrow', role: 'client', primary: true },
  // { href: '/escrow/zap', label: 'Escrow Zap', role: 'member' },
];

interface NavItem {
  label: string;
  href: string;
}

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { setCommandPallet: setOpen } = useOverlay();
  const session = useSession();

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
    {_.map(links, ({ href, label, role: linkRole, primary }) => {
      if (!role || !primary) return null;
      if (linkRole === 'member' && role !== 'member') return null;
      // ? handle escrow in more menu for members
      if (role === 'member' && href === '/escrow') return null;

      return (
        <Link key={href} href={href}>
          <Heading size='sm'>{label}</Heading>
        </Link>
      );
    })}
    {role === 'member' && (
      <Menu>
        <MenuButton
          as={Button}
          bg='transparent'
          _hover={{ bg: 'whiteAlpha.300' }}
          _active={{ bg: 'whiteAlpha.200' }}
          textTransform='capitalize'
        >
          <HStack>
            <Heading size='sm'>More</Heading>
            <Icon as={BsCaretDown} />
          </HStack>
        </MenuButton>
        <MenuList>
          {_.map(links, ({ href, label, primary }) => {
            if (primary && href !== '/escrow') return null;

            return (
              <Link href={href} key={href}>
                <MenuItem>
                  <Heading size='sm'>{label}</Heading>
                </MenuItem>
              </Link>
            );
          })}
        </MenuList>
      </Menu>
    )}
  </HStack>
);

const MobileNav = ({ role }: { role: string }) => (
  <Stack p={4} display={{ md: 'none' }} bg='whiteAlpha.200' mb={5}>
    {_.map(links, ({ href, label, role: linkRole }) => {
      if (!role) return null;
      if (linkRole === 'member' && role !== 'member') return null;
      // TODO handle user?

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
