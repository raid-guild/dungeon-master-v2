import _ from 'lodash';
import {
  BuiltByRaidGuildComponent,
  Flex,
  Link,
  Stack,
} from '@raidguild/design-system';

const links = [
  { label: 'Consultation Queue', link: 'https://hireus.raidguild.org/bids' },
  { label: 'Smart Invoice', link: 'https://smartinvoice.xyz' },
];

const Footer = () => (
  <Flex justify="space-around" mb="50px">
    <BuiltByRaidGuildComponent />
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
