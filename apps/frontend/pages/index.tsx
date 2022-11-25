import * as React from 'react';
import { Flex, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import SiteLayout from '../components/SiteLayout';

const Home: React.FC = () => {
  return (
    <>
      <NextSeo title="Dashboard" />

      <SiteLayout subheader={<Heading>Dungeon Master v1.5</Heading>}>
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={8}
        >
          Coming soon...
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Home;
