import { Flex } from '@chakra-ui/react';

import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }) => {
  return (
    <Flex
      minH='100vh'
      position='relative'
      direction='column'
      justify='space-between'
      align='center'
      background='blackLight'
      color='red'
      overflowY='scroll'
    >
      <Header />
      <Flex maxW='100rem' w='100%' direction='column' alignItems='center'>
        {children}
        <br />
      </Flex>
      <Footer />
    </Flex>
  );
};
