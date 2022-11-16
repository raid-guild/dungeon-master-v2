import * as React from 'react';
import { Flex, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import ConnectWallet from '../components/ConnectWallet';
import SiteLayout from '../components/SiteLayout';

const Home: React.FC = () => {
  return (
    <>
      <NextSeo title="Dashboard" />
      <Flex>
        <SiteLayout>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={8}
          >
            <Heading>Dungeon Master v1.5</Heading>
            <ConnectWallet />
          </Flex>
        </SiteLayout>
      </Flex>
    </>
  );
};

export default Home;
