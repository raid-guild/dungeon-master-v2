/* eslint-disable react/jsx-props-no-spreading */
import '@rainbow-me/rainbowkit/styles.css';
// eslint-disable-next-line import/no-unresolved
import 'react-datepicker/dist/react-datepicker.css'; // trouble processing this css in the DS pkg currently

import { wagmiConfig } from '@raidguild/dm-utils';
import { Toaster, TooltipProvider } from '@raidguild/ui';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import {
  // QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import { OverlayContextProvider } from '../contexts/OverlayContext';

const App = ({ Component, pageProps }: AppProps) => {
  // const toast = useToast();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: 20 * 60 * 1000, // 20 minutes
        refetchOnWindowFocus: false,
      },
    },
    // queryCache: new QueryCache({
    //   onError: (error) => {
    //     toast.error({
    //       title: 'Something went wrong.',
    //       iconName: 'alert',
    //       description: `Please try again: ${error}`,
    //     });
    //   },
    // }),
  });

  return (
    <>
      <DefaultSeo
        titleTemplate='%s | Dungeon Master'
        title='Dungeon Master'
        defaultTitle='Raid Guild | Dungeon Master'
        description='Adventurers, come and gather around the campfire.'
        canonical='https://dm.raidguild.org'
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://dm.raidguild.org',
          site_name: 'Raid Guild',
          title: 'Dungeon Master',
          description: 'Adventurers, come and gather around the campfire.',
          // images: [
          //   {
          //     url: '/raidguild-logo', // replace with your OG image
          //     width: 1200,
          //     height: 630,
          //     alt: "Raid Guild logo: Crossed swords with 'Raid Guild'",
          //   },
          // ],
        }}
      />

      <WagmiProvider config={wagmiConfig}>
        <SessionProvider
          session={pageProps.session}
          refetchInterval={8 * 60 * 1000}
          refetchOnWindowFocus={false}
        >
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider>
              <RainbowKitProvider theme={darkTheme()}>
                <OverlayContextProvider>
                  <TooltipProvider>
                    <Component {...pageProps} />
                    <Toaster richColors />
                  </TooltipProvider>
                  <ReactQueryDevtools initialIsOpen={false} />
                </OverlayContextProvider>
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
    </>
  );
};
export default App;
