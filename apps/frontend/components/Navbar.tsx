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
  useDisclosure,
} from '@raidguild/design-system';
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@raidguild/ui';
import _ from 'lodash';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsCaretDown } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';

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
      <div className='flex justify-between p-8 font-texturina'>
        <div className='flex items-center'>
          <Link className='mr-6 text-xl' href='/'>
            🏰
          </Link>
          <div className='hidden md:flex'>
            <DesktopNav role={role} />
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <Tooltip>
            <TooltipTrigger aria-label='Search Button'>
              <Button
                size='icon'
                variant='ghost'
                type='button'
                onClick={() => setOpen(true)}
              >
                <Search className='h-6 w-6' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Press <kbd>CMD</kbd> + <kbd>K</kbd> to search
              </p>
            </TooltipContent>
          </Tooltip>
          <div className='hidden md:flex'>
            <ConnectWallet />
          </div>
          <div className='flex flex-1 md:hidden -ml-2'>
            <Button
              size='icon'
              variant='ghost'
              onClick={onToggle}
              aria-label='Toggle Navigation'
            >
              isOpen ? (
              <AiOutlineClose width={3} height={3} />
              ) : (
              <GiHamburgerMenu width={5} height={5} />)
            </Button>
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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              More
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='w-[120px]'>
                {_.map(links, ({ href, label, primary }) => {
                  if (primary && href !== '/escrow') return null;

                  return (
                    <NavigationMenuLink
                      className='select-none hover:bg-gray-600'
                      href={href}
                      key={href}
                    >
                      <h3 className='text-sm'>{label}</h3>
                    </NavigationMenuLink>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
