/* eslint-disable no-use-before-define */
import {
  Box,
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
import { Button } from '@raidguild/ui';
import _ from 'lodash';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsCaretDown } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { HiSearch } from 'react-icons/hi';

import { useOverlay } from '../contexts/OverlayContext';
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
    <>
      <div className='flex justify-between p-8'>
        <div className='flex items-center'>
          <Link className='mr-6' href='/'>
            <h1>🏰</h1>
          </Link>
          <div className='hidden md:flex'>
            <DesktopNav role={role} />
          </div>
        </div>

        <div className='flex items-center'>
          <Button
            type='button'
            className='cursor-pointer mx-6 hidden md:flex'
            onClick={() => setOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
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
          </Button>
          <div className='hidden md:flex'>
            <ConnectWallet />
          </div>
          <div className='flex flex-1 md:hidden -ml-2'>
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
          </div>
        </div>
      </div>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav role={role} />
      </Collapse>
    </>
  );
};

const DesktopNav = ({ role }: { role: string }) => (
  <div className='flex items-center gap-4'>
    {_.map(links, ({ href, label, role: linkRole, primary }) => {
      if (!role || !primary) return null;
      if (linkRole === 'member' && role !== 'member') return null;
      // ? handle escrow in more menu for members
      if (role === 'member' && href === '/escrow') return null;

      return (
        <Link key={href} href={href}>
          <h3 className='text-sm'>{label}</h3>
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
  </div>
);

const MobileNav = ({ role }: { role: string }) => (
  <div className='p-4 flex flex-col md:hidden bg-white mb-5'>
    {_.map(links, ({ href, label, role: linkRole }) => {
      if (!role) return null;
      if (linkRole === 'member' && role !== 'member') return null;
      // TODO handle user?

      return <MobileNavItem key={href} href={href} label={label} />;
    })}
    <ConnectWallet />
  </div>
);

const MobileNavItem = ({ href, label }: NavItem) => (
  <div className='flex flex-col gap-4'>
    <Link className='py-2' key={href} href={href}>
      <h3 className='text-sm'>{label}</h3>
    </Link>
  </div>
);

export default Navbar;
