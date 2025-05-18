/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
// TODO fix
import 'react-cmdk/dist/cmdk.css';

import { Flex, Spinner } from '@raidguild/design-system';
import { useSearchResults } from '@raidguild/dm-hooks';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@raidguild/ui';
import { filterItems, JsonStructure } from '@raidguild/utils';
import _ from 'lodash';
import { House, ScrollText, Star, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { useOverlay } from '../contexts/OverlayContext';

export interface CommandPaletteProps {
  items: Array<{
    id: string;
    children: string;
    icon: ReactNode;
    href: string;
  }>;
  heading?: string | undefined;
  id: string;
}

// const CommandPaletteInternalLink = ({
//   href,
//   children,
// }: {
//   href: string;
//   children: ReactNode;
// }) => (
//   <Link href={href}>
//     <div className='flex justify-between p-2 w-full'>{children}</div>
//   </Link>
// );

let timeout = null;

const CommandPalette = () => {
  const [page] = useState<'root' | 'projects'>('root');
  const router = useRouter();
  const { commandPallet: isOpen, setCommandPallet: setOpen } = useOverlay();
  const [search, setSearch] = useState('');
  const [serverSearch, setServerSearch] = useState<string | null>(null);
  const [localResults, setLocalResults] = useState<CommandPaletteProps | null>(
    null
  );
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: searchData } = useSearchResults({
    token,
    search: serverSearch,
  });

  useEffect(() => {
    if (serverSearch && searchData) {
      setLocalResults(searchData);
    } else {
      setLocalResults(null);
    }
  }, [serverSearch, searchData]);

  const setSearchTimeout = (value: string) => {
    clearTimeout(timeout);
    setSearch(value);

    timeout = setTimeout(() => {
      setServerSearch(value);
    }, 500);
  };

  const handleClose = useCallback(() => {
    console.log(isOpen);
    if (isOpen) {
      setOpen(false);
      setTimeout(() => {
        setServerSearch(null);
        setSearch('');
      }, 500);
    } else {
      setOpen(true);
    }
  }, [isOpen]);

  const searchResults: JsonStructure = filterItems(
    [
      {
        heading: 'Raids',
        id: 'raids',
        items: _.get(localResults, 'raids', []),
      },
      {
        heading: 'Members',
        id: 'members',
        items: _.get(localResults, 'members', []),
      },
      {
        heading: 'Consultations',
        id: 'consultations',
        items: _.get(localResults, 'consultations', []),
      },
      {
        heading: 'Applications',
        id: 'applications',
        items: _.get(localResults, 'applications', []),
      },
    ],
    search
  );

  const filteredItems = filterItems(
    [
      {
        heading: 'Navigate',
        id: 'navigation',
        items: [
          {
            id: 'dashboard',
            children: 'Dashboard',
            icon: <House />,
            href: '/',
          },
          {
            id: 'raids',
            children: 'Raids',
            icon: <Star />,
            href: '/raids',
          },
          {
            id: 'members',
            children: 'Members',
            icon: <Users />,
            href: '/members',
          },
          {
            id: 'consultations',
            children: 'Consultations',
            icon: <ScrollText />,
            href: '/consultations',
          },
          {
            id: 'applications',
            children: 'Applications',
            icon: <UserPlus />,
            href: '/applications',
          },
        ],
      },
      // TODO other options? update raid status etc -> v2
    ],
    search
  );

  return (
    <CommandDialog onOpenChange={handleClose} open={isOpen}>
      <CommandInput
        placeholder='Search'
        onValueChange={setSearchTimeout}
        value={search}
      />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        {filteredItems.length
          ? filteredItems.map((list) => (
              <CommandGroup key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandItem
                    key={id}
                    className='cursor-pointer'
                    onSelect={() => router.push(_.get(rest, 'href')!)}
                    // index={getItemIndex(filteredItems, id)}
                    // renderLink={({ href, children }) => (
                    //   <CommandPaletteInternalLink href={href}>
                    //     {children}
                    //   </CommandPaletteInternalLink>
                    // )}
                    // {...rest}
                  >
                    {_.get(rest, 'icon')}
                    {_.get(rest, 'children')}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          : _.map(searchResults, (group) => (
              <CommandGroup key={group.id} heading={group.heading}>
                {_.map(_.get(group, 'items'), ({ id, ...rest }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => router.push(_.get(rest, 'href')!)}
                    // index={getItemIndex(searchResults, id)}
                    //   renderLink={({ href, children }) => (
                    //     <CommandPaletteInternalLink href={href}>
                    //       {children}
                    //     </CommandPaletteInternalLink>
                    //   )}
                    //   {...rest}
                    // />
                  >
                    {_.get(rest, 'icon')}
                    {_.get(rest, 'children')}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
      </CommandList>
      {/* <CmdkCommandPalette.Page id='projects'> */}
      {/* Projects page */}
      {/* </CmdkCommandPalette.Page> */}
    </CommandDialog>
  );
};

export default CommandPalette;
