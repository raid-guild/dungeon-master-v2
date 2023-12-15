import {
  BuiltByRaidGuild,
  Flex,
  Heading,
  Link,
  Stack,
  useMediaQuery,
} from '@raidguild/design-system';
import _ from 'lodash';
import { useSession } from 'next-auth/react';

const links = [
  // { label: 'Consultation Queue', link: 'https://www.raidguild.org/hire/1' },
  { label: 'Handbook', link: 'https://handbook.raidguild.org' },
  { label: 'Smart Invoice', link: 'https://smartinvoice.xyz' },
  { label: 'Origins', link: 'https://origins.raidguild.org' },
  {
    label: 'Valhalla',
    link: 'https://the-valhalla.vercel.app',
    type: 'member',
  },
];

const Footer = () => {
  const [upTo780] = useMediaQuery('(max-width: 780px)');
  const { data: session } = useSession();

  const filteredLinks = !session ? _.reject(links, ['type', 'member']) : links;

  return (
    <Flex justify='space-around' mb='50px' mt='200px'>
      {!upTo780 ? <BuiltByRaidGuild /> : <Heading size='sm'>RaidGuild</Heading>}
      <Stack>
        {_.map(filteredLinks, (link) => (
          <Link href={link.link} isExternal key={link.link}>
            {link.label}
          </Link>
        ))}
      </Stack>
    </Flex>
  );
};

export default Footer;
