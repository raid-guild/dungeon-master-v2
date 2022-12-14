import { useEffect, useState } from 'react';
import CmdkCommandPalette, {
  filterItems,
  getItemIndex,
  useHandleOpenCommandPalette,
  JsonStructure,
} from 'react-cmdk';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { Flex, Spinner } from '@raidguild/design-system';
import 'react-cmdk/dist/cmdk.css';

import useSearchResults from '../hooks/useSearchResults';
import ChakraNextLink from './ChakraNextLink';

const CommandPaletteInternalLink = ({ href, children }) => (
  <ChakraNextLink href={href}>
    <Flex w="100%" justify="space-between" p={2}>
      {children}
    </Flex>
  </ChakraNextLink>
);

let timeout = null;

const CommandPalette = () => {
  const [page, setPage] = useState<'root' | 'projects'>('root');
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [serverSearch, setServerSearch] = useState<string | null>(null);
  const [localResults, setLocalResults] = useState<JsonStructure>(null);
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: searchData, isLoading } = useSearchResults({
    token,
    search: serverSearch,
  });

  useEffect(() => {
    console.log(searchData);
    if (serverSearch && searchData) {
      console.log(searchData);
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

  const handleClose = () => {
    if (open) {
      setOpen(false);
      setTimeout(() => {
        setServerSearch(null);
        setSearch('');
      }, 250);
    } else {
      setOpen(true);
    }
  };

  useHandleOpenCommandPalette(setOpen);
  // TODO add sections for each result group
  // TODO use `filterItems`
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
            icon: 'HomeIcon',
            href: '/',
          },
          {
            id: 'raids',
            children: 'Raids',
            icon: 'CogIcon',
            href: '/raids',
          },
          {
            id: 'members',
            children: 'Members',
            icon: 'HomeIcon',
            href: '/members',
          },
        ],
      },
      {
        heading: 'Other',
        id: 'advanced',
        items: [
          {
            id: 'developer-settings',
            children: 'Developer settings',
            icon: 'HomeIcon',
            href: '#',
          },
          {
            id: 'privacy-policy',
            children: 'Privacy policy',
            icon: 'HomeIcon',
            href: '#',
          },
          {
            id: 'disconnect',
            children: 'Disconnect',
            icon: 'HomeIcon',
            onClick: () => {
              alert('Logging out...');
            },
          },
        ],
      },
    ],
    search
  );

  return (
    <CmdkCommandPalette
      onChangeSearch={setSearchTimeout}
      onChangeOpen={handleClose}
      search={search}
      isOpen={open}
      page={page}
    >
      <CmdkCommandPalette.Page id="root">
        {filteredItems.length ? (
          filteredItems.map((list) => (
            <CmdkCommandPalette.List key={list.id} heading={list.heading}>
              {list.items.map(({ id, ...rest }) => (
                <CmdkCommandPalette.ListItem
                  key={id}
                  index={getItemIndex(filteredItems, id)}
                  renderLink={({ href, children }) => (
                    <CommandPaletteInternalLink href={href}>
                      {children}
                    </CommandPaletteInternalLink>
                  )}
                  {...rest}
                />
              ))}
            </CmdkCommandPalette.List>
          ))
        ) : (
          <CmdkCommandPalette.List
            key={searchResults[0]?.id}
            heading={searchResults[0]?.heading}
          >
            {_.get(searchResults, '[0].items') ? (
              searchResults[0]?.items?.map(({ id, ...rest }) => (
                <CmdkCommandPalette.ListItem
                  key={id}
                  index={getItemIndex(searchResults, id)}
                  renderLink={({ href, children }) => (
                    <CommandPaletteInternalLink href={href}>
                      {children}
                    </CommandPaletteInternalLink>
                  )}
                  {...rest}
                />
              ))
            ) : (
              <Flex justify="center" p={4}>
                <Spinner />
              </Flex>
            )}
          </CmdkCommandPalette.List>
        )}
      </CmdkCommandPalette.Page>

      <CmdkCommandPalette.Page id="projects">
        {/* Projects page */}
      </CmdkCommandPalette.Page>
    </CmdkCommandPalette>
  );
};

export default CommandPalette;
