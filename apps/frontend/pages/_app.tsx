import * as React from 'react';
import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { SessionProvider } from 'next-auth/react';
import { WagmiConfig } from 'wagmi';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import { RGThemeProvider, useToast } from '@raidguild/design-system';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { wagmiClient } from '../utils/wagmiClient';
import { chains } from '../utils/chains';

import '@rainbow-me/rainbowkit/styles.css';
import { OverlayContextProvider } from '../contexts/OverlayContext';
import '@fontsource/uncial-antiqua';
import '@fontsource/texturina';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const toast = useToast();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: 1200 * 1000,
        refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error({
          title: 'Something went wrong.',
          iconName: 'alert',
          description: `Please try again: ${error}`,
        });
      },
    }),
  });

  return (
    <RGThemeProvider>
      <DefaultSeo
        titleTemplate="%s | Dungeon Master v1.5"
        title="Dungeon Master"
        defaultTitle="Raid Guild | Dungeon Master v1.5"
        description="Adventurers, come and gather around the campfire."
        canonical="https://site-url"
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://site-url',
          site_name: 'Site title',
          title: "Raid Guild | Dungeon Master v1.5'",
          description: 'Adventurers, come and gather around the campfire.',
          images: [
            {
              url: '/raidguild-logo', // replcace with your OG image
              width: 1200,
              height: 630,
              alt: "Raid Guild logo: Crossed swords with 'Raid Guild'",
            },
          ],
        }}
      />

      <WagmiConfig client={wagmiClient}>
        <SessionProvider
          session={pageProps.session}
          refetchInterval={8 * 60 * 1000}
          refetchOnWindowFocus={true}
        >
          <RainbowKitSiweNextAuthProvider>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>
              <QueryClientProvider client={queryClient}>
                <OverlayContextProvider>
                  <Component {...pageProps} />
                  <ReactQueryDevtools initialIsOpen={false} />
                </OverlayContextProvider>
              </QueryClientProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </RGThemeProvider>
  );
};
export default MyApp;
