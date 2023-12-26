import { Button, Flex, Heading } from '@raidguild/design-system';

import ChakraNextLink from '../../ChakraNextLink';

const Page404 = ({ heading, primaryLink }: Page404Props) => (
  <Flex
    w='100%'
    direction='column'
    alignItems='center'
    justifyContent='center'
    gap={20}
    mt={20}
  >
    <Heading size='lg' fontFamily='texturina'>
      {heading || 'Page not found'}
    </Heading>
    <Flex direction={{ lg: 'row', base: 'column' }} gap={4}>
      <ChakraNextLink href='/'>
        <Button variant={!primaryLink ? 'solid' : 'outline'}>Back Home</Button>
      </ChakraNextLink>
      {primaryLink && (
        <ChakraNextLink href={primaryLink.link}>
          <Button>{primaryLink.label}</Button>
        </ChakraNextLink>
      )}
    </Flex>
  </Flex>
);

interface Page404Props {
  heading?: string;
  primaryLink?: {
    link: string;
    label: string;
  };
}

export default Page404;
