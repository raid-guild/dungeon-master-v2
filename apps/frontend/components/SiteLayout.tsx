/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { ReactNode, useEffect, useState } from 'react';
import { useAccount, useConfig, useConnect } from 'wagmi';

import CommandPalette from './CommandPalette';
import Footer from './Footer';
import Navbar from './Navbar';
import ScrollToTopButton from './ScrollToTopButton';
import Spinner from './Spinner';

interface SiteLayoutProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  subheader?: ReactNode;
  emptyDataPhrase?: string;
  error?: Error | boolean;
  isLoading?: boolean;
  minHeight?: string;
}

type GeneralLayoutProps = {
  minHeight?: string;
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
  <div className='flex flex-col overflow-x-hidden min-h-[100vh] min-w-[100%] relative bg-gray-700'>
    <Navbar />
    <CommandPalette />
    <div className='flex flex-1 flex-col justify-start items-center min-h-[100vh] min-w-[100%]'>
      <div className='flex flex-col space-y-8 w-[90%] md:w-[80%] mx-auto'>
        {subheader}
        {children}
      </div>
    </div>
    {showScrollToTopButton && <ScrollToTopButton />}
    <Footer />
  </div>
);

const SiteLayout = ({
  isLoading,
  data,
  error,
  subheader,
  emptyDataPhrase,
  children,
  minHeight = '100vh',
}: SiteLayoutProps) => {
  const { data: session } = useSession();
  const { pathname } = useRouter();

  // TODO handle autoconnect
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);
  const { address } = useAccount();
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

  if (!_.get(session, 'token')) {
    return (
      <GeneralLayout
        showScrollToTopButton={showScrollToTopButton}
        subheader={subheader}
        minHeight={minHeight}
      >
        <div className='flex items-center justify-center min-h-[70vh]'>
          <h1 className='text-xl font-uncial'>Connect your wallet & Sign in</h1>
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
        <div className='flex w-full justify-center items-center py-15'>
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
        <div className='flex w-full justify-center items-center py-10'>
          <h1 className='text-xl font-uncial'>
            Error loading data
            {typeof error === 'object' && `: ${error.message}`}
          </h1>
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
        <h1 className='text-xl font-uncial'>
          {emptyDataPhrase || 'No raids found!'}
        </h1>
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

export default SiteLayout;
