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
          <>
            <Heading>Dungeon Master v1.5</Heading>
            <ConnectWallet />
          </>
        </SiteLayout>
      </Flex>
    </>
  );
};

export default Home;
