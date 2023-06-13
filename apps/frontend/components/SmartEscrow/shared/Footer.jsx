import { Flex, Link, Box, Image as ChakraImage, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Flex
      w='100%'
      px='3rem'
      direction={{ base: 'column', lg: 'row' }}
      align='center'
      justify={{ base: 'center', lg: 'space-between' }}
    >
      <Link href='https://raidguild.org' isExternal zIndex={5}>
        <Box h='auto' w='150px' mb='1rem'>
          <ChakraImage src='/footerLogo.svg' alt='built-by-raid-guild' />
        </Box>
      </Link>
      <Text mb='1rem' fontSize='sm' fontFamily={}>
        DM.Version 2.0.0
      </Text>
    </Flex>
  );
};
