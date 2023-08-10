import { Flex, Button, Heading } from '@raidguild/design-system';
import Link from 'next/link';

export const Page404 = () => {
  return (
    <Flex
      w='100%'
      direction='column'
      alignItems='center'
      justifyContent='center'
    >
      <Heading size='lg'>Page not found</Heading>
      <Flex direction={{ lg: 'row', base: 'column' }} mt='2rem'>
        <Link href='/' passHref>
          <Button
            variant='solid'
            mr={{ lg: '1rem', base: '0' }}
            mb={{ lg: '0', base: '1rem' }}
          >
            Back Home
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};
