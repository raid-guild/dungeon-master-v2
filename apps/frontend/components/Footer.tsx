import _ from 'lodash';
import { BuiltByRaidGuild, Flex, Link, Stack } from '@raidguild/design-system';

const links = [
  { label: 'Consultation Queue', link: 'https://www.raidguild.org/hire/1' },
  { label: 'Smart Invoice', link: 'https://smartinvoice.xyz' },
];

const Footer = () => (
  <Flex justify='space-around' mb='50px' mt='200px'>
    <BuiltByRaidGuild />
    <Stack>
      {_.map(links, (link) => (
        <Link href={link.link} isExternal key={link.link}>
          {link.label}
        </Link>
      ))}
    </Stack>
  </Flex>
);

export default Footer;
