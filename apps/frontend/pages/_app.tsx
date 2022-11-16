import * as React from 'react';
import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { RGThemeProvider, useToast } from '@raidguild/design-system';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiClient } from '../utils/wagmiClient';
import { chains } from '../utils/chains';
import { WagmiConfig } from 'wagmi';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import SiteLayout from '../components/SiteLayout';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const toast = useToast();
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast({
          title: 'Something went wrong.',
          status: 'error',
          description: `Please try again: ${error}`,
        });
      },
    }),
  });
  return (
    <RGThemeProvider>
      <DefaultSeo
        titleTemplate="%s | Dungeon Master v1"
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
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <QueryClientProvider client={queryClient}>
            <SiteLayout>
              <Component {...pageProps} />
            </SiteLayout>
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </RGThemeProvider>
  );
};
export default MyApp;
