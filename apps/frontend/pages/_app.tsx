import * as React from 'react';
import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { RGThemeProvider } from '@raidguild/design-system';
import SiteLayout from '../components/SiteLayout';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
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
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </RGThemeProvider>
  );
};
export default MyApp;
