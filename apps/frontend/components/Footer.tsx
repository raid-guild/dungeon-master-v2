import _ from 'lodash';
import {
  BuiltByRaidGuild,
  Flex,
  Heading,
  Link,
  Stack,
  useMediaQuery,
} from '@raidguild/design-system';

const links = [
  // { label: 'Consultation Queue', link: 'https://www.raidguild.org/hire/1' },
  { label: 'Handbook', link: 'https://handbook.raidguild.org' },
  { label: 'Smart Invoice', link: 'https://smartinvoice.xyz' },
];

const Footer = () => {
  const [upTo780] = useMediaQuery('(max-width: 780px)');
  return (
    <Flex justify='space-around' mb='50px' mt='200px'>
      {!upTo780 ? <BuiltByRaidGuild /> : <Heading size='sm'>RaidGuild</Heading>}
      <Stack>
        {_.map(links, (link) => (
          <Link href={link.link} isExternal key={link.link}>
            {link.label}
          </Link>
        ))}
      </Stack>
    </Flex>
  );
};

export default Footer;
