/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useAccount, useConfig, useConnect } from 'wagmi';

import CommandPalette from './CommandPalette';
import Footer from './Footer';
import Navbar from './Navbar';
import ScrollToTopButton from './ScrollToTopButton';
import Spinner from './Spinner';

interface SiteLayoutPublicProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  subheader: ReactNode;
  emptyDataPhrase?: string;
  error?: Error;
  isLoading?: boolean;
  minHeight?: string | string[];
}

type GeneralLayoutProps = {
  minHeight?: string | string[];
  subheader?: ReactNode;
  showScrollToTopButton?: boolean;
  children?: ReactNode;
};

const GeneralLayout = ({
  minHeight,
  subheader,
  showScrollToTopButton,
  children,
}: GeneralLayoutProps) => (
  <div
    className={`flex flex-col overflow-hidden m-auto min-h-[${
      minHeight || '100%'
    }] min-w-full relative bg-gray-700`}
  >
    <Navbar />
    <CommandPalette />
    <div className='flex flex-1 flex-col justify-start items-center min-h-[50vh] lg:min-h-[100vh]'>
      <div className='flex flex-col space-y-8 items-center w-[90%] lg:w-[80%] mx-auto'>
        {subheader}
        {children}
      </div>
    </div>
    {showScrollToTopButton && <ScrollToTopButton />}
    <Footer />
  </div>
);

const SiteLayoutPublic = ({
  isLoading,
  data,
  error,
  subheader,
  emptyDataPhrase,
  children,
  minHeight = '100vh',
}: SiteLayoutPublicProps) => {
  const { pathname } = useRouter();

  // Copied as it is from 'SiteLayout.tsx'
  // TODO handle autoconnect
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);
  const { address, chain } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const client = useConfig();

  useEffect(() => {
    if (isAutoConnecting) return;
    if (address) return;

    setIsAutoConnecting(true);

    const autoConnect = async () => {
      const lastUsedConnector = client.storage?.getItem('wallet');

      const sorted = lastUsedConnector
        ? [...connectors].sort((x) => (x.id === lastUsedConnector ? -1 : 1))
        : connectors;

      for (const connector of sorted) {
        if (!connector.ready || !connector.isAuthorized) continue;
        const isAuthorized = await connector.isAuthorized();
        if (!isAuthorized) continue;

        await connectAsync({ connector });
        break;
      }
    };

    autoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showScrollToTopButton =
    pathname === '/raids' ||
    pathname === '/consultations' ||
    pathname === '/members' ||
    pathname === '/applications';

  if (!chain) {
    return (
      <GeneralLayout
        showScrollToTopButton={showScrollToTopButton}
        subheader={subheader}
        minHeight={minHeight}
      >
        <div className='flex items-center justify-center min-h-[70vh] max-w-[70%] lg:max-w-full'>
          <h1 className='text-md text-center'>Connect your wallet & Sign in</h1>
        </div>
      </GeneralLayout>
    );
  }

  if (isLoading) {
    return (
      <GeneralLayout
        showScrollToTopButton={showScrollToTopButton}
        subheader={subheader}
        minHeight={minHeight}
      >
        <div className='flex w-full h-full justify-center items-center py-[60px]'>
          <Spinner />
        </div>
      </GeneralLayout>
    );
  }

  if (error) {
    return (
      <GeneralLayout
        showScrollToTopButton={showScrollToTopButton}
        subheader={subheader}
        minHeight={minHeight}
      >
        <div className='w-full flex justify-center pt-[40px]'>
          <h1 className='text-md'>Error loading data: {error.message}</h1>
        </div>
      </GeneralLayout>
    );
  }

  return data && _.isEmpty(data) ? (
    <GeneralLayout
      showScrollToTopButton={showScrollToTopButton}
      subheader={subheader}
      minHeight={minHeight}
    >
      <div className='flex justify-center items-center min-h-[50vh]'>
        <h1 className='text-md'>{emptyDataPhrase || 'No raids found!'}</h1>
      </div>
    </GeneralLayout>
  ) : (
    <GeneralLayout
      showScrollToTopButton={showScrollToTopButton}
      subheader={subheader}
      minHeight={minHeight}
    >
      {children}
    </GeneralLayout>
  );
};

export default SiteLayoutPublic;
