import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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

const Navbar = () => {
  const [open, onOpen] = useState(false);
  const { setCommandPallet: setOpen } = useOverlay();
  const session = useSession();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const role = _.get(session, 'data.user.role');

  return (
    <div className='flex flex-wrap md:flex-nowrap gap-6 p-8 font-texturina'>
      <Link className='mr-6 text-xl' href='/'>
        🏰
      </Link>
      <div className='hidden md:flex'>
        <DesktopNav role={role} />
      </div>
      <div className='flex flex-1' />
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
            Press{' '}
            <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
              CMD
            </kbd>{' '}
            +{' '}
            <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
              K
            </kbd>{' '}
            to search
          </p>
        </TooltipContent>
      </Tooltip>
      <div className='flex md:hidden'>
        <MobileNav open={open} onOpen={onOpen} role={role} />
      </div>
      <ConnectWallet />
    </div>
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
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
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

const MobileNav = ({
  open,
  onOpen,
  role,
}: {
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
  role: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button
        size='icon'
        variant='ghost'
        onClick={() => onOpen(!open)}
        aria-label='Toggle Navigation'
      >
        {open ? <X /> : <Menu />}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {_.map(links, ({ href, label, role: linkRole }) => {
        if (!role) return null;
        if (linkRole === 'member' && role !== 'member') return null;
        // TODO handle user?

        return (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>{label}</Link>
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default Navbar;
