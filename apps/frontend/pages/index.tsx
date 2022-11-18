import * as React from 'react';
import { Flex, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';

const Home: React.FC = () => {
  return (
    <>
      <NextSeo title="Dashboard" />

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <Heading>Dungeon Master v1.5</Heading>
      </Flex>
    </>
  );
};

export default Home;
