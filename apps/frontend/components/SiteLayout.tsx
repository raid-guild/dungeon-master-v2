import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { Flex, Heading, Spinner, Stack } from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import Footer from './Footer';
import CommandPalette from './CommandPalette';
import ScrollToTopButton from './ScrollToTopButton';

interface SiteLayoutProps {
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
  other?: ReactNode;
  children?: ReactNode;
};

const SiteLayout: React.FC<SiteLayoutProps> = ({
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

  const showScrollToTopButton =
    pathname === '/raids' ||
    pathname === '/consultations' ||
    pathname === '/members' ||
    pathname === '/applications';

  const GeneralLayout = ({ children }: GeneralLayoutProps) => (
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
          w={['90%', null, null, '70%']}
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

  if (!_.get(session, 'token')) {
    return (
      <GeneralLayout>
        <Flex justify='center' align='center' minH='100vh'>
          <Heading size='md'>Connect your wallet & Sign in</Heading>
        </Flex>
      </GeneralLayout>
    );
  }

  if (isLoading) {
    return (
      <GeneralLayout>
        <Flex w='100%' justify='center' alignItems='center' py={60}>
          <Spinner size='xl' />
        </Flex>
      </GeneralLayout>
    );
  }

  if (error) {
    return (
      <GeneralLayout>
        <Flex w='100%' justify='center' pt={40}>
          <Heading size='md'>
            <>Error loading data: {error}</>
          </Heading>
        </Flex>
      </GeneralLayout>
    );
  }

  return data && _.isEmpty(data) ? (
    <GeneralLayout>
      <Flex justify='center' align='center' minH='50vh'>
        <Heading size='md'>{emptyDataPhrase || 'No raids found!'}</Heading>
      </Flex>
    </GeneralLayout>
  ) : (
    <GeneralLayout>{children}</GeneralLayout>
  );
};

export default SiteLayout;
