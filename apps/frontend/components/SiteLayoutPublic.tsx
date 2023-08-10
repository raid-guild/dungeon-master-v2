import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useNetwork } from 'wagmi';
import { Flex, Heading, Spinner, Stack } from '@raidguild/design-system';
import Navbar from './Navbar';
import Footer from './Footer';
import CommandPalette from './CommandPalette';
import ScrollToTopButton from './ScrollToTopButton';

interface SiteLayoutPublicProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  subheader: ReactNode;
  emptyDataPhrase?: string;
  error?: Error;
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
  <Flex
    direction='column'
    overflowX='hidden'
    margin='0 auto'
    minHeight={minHeight || '100vh'}
    minWidth={['100%', null, null, '100vw']}
    position='relative'
    background='gray.700'
  >
    <Navbar />
    <CommandPalette />
    <Flex
      direction='column'
      justify='flex-start'
      flex='1'
      align='center'
      minHeight={['100vh', '100vh', '0', '0']}
    >
      <Stack
        spacing={8}
        align='center'
        w={['90%', null, null, '80%']}
        mx='auto'
      >
        {subheader}
        {children}
      </Stack>
    </Flex>
    {showScrollToTopButton && <ScrollToTopButton />}
    <Footer />
  </Flex>
);

const SiteLayoutPublic: React.FC<SiteLayoutPublicProps> = ({
  isLoading,
  data,
  error,
  subheader,
  emptyDataPhrase,
  children,
  minHeight = '100vh',
}: SiteLayoutPublicProps) => {
  const { chain } = useNetwork();
  const { pathname } = useRouter();

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
        <Flex justify='center' align='center' minH='70vh'>
          <Heading size='md'>Connect your wallet & Sign in</Heading>
        </Flex>
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
        <Flex w='100%' justify='center' alignItems='center' py={60}>
          <Spinner size='xl' />
        </Flex>
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
        <Flex w='100%' justify='center' pt={40}>
          <Heading size='md'>Error loading data: {error.message}</Heading>
        </Flex>
      </GeneralLayout>
    );
  }

  return data && _.isEmpty(data) ? (
    <GeneralLayout
      showScrollToTopButton={showScrollToTopButton}
      subheader={subheader}
      minHeight={minHeight}
    >
      <Flex justify='center' align='center' minH='50vh'>
        <Heading size='md'>{emptyDataPhrase || 'No raids found!'}</Heading>
      </Flex>
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
