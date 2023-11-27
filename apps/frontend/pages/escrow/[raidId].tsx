import { Card, Flex, Heading, Spinner, Text } from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { SUPPORTED_NETWORKS } from '@raidguild/escrow-gql';
import { useInvoiceDetails } from '@raidguild/escrow-hooks';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useAccount, useNetwork } from 'wagmi';

import SiteLayoutPublic from '../../components/SiteLayoutPublic';
import InvoiceButtonManager from '../../components/SmartEscrow/InvoiceButtonManager';
import InvoiceMetaDetails from '../../components/SmartEscrow/InvoiceMetaDetails';
import InvoicePaymentDetails from '../../components/SmartEscrow/InvoicePaymentDetails';
import ProjectInfo from '../../components/SmartEscrow/ProjectInfo';
import Page404 from '../../components/SmartEscrow/shared/Page404';

const WRONG_NETWORK_MESSAGE =
  'This network is not supported: Switch to Gnosis Chain';
const NOT_CONNECTED_MESSAGE =
  'Connect your wallet to fetch invoice information.';

const Escrow = ({ raidId }: { raidId: string }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { data: raid, isLoading: raidLoading } = useRaidDetail({
    raidId,
    token,
  });
  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useInvoiceDetails({
    invoiceAddress: raid?.invoiceAddress,
    chainId: chain?.id,
  });

  const wrongChain = !_.includes(SUPPORTED_NETWORKS, chain?.id);

  if (!token) {
    return (
      <>
        <NextSeo title='Not Found' />

        <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
          <Flex direction='column' alignItems='center' w='100%' pt='150px'>
            <Heading>Connect your wallet & Sign in</Heading>
          </Flex>
        </SiteLayoutPublic>
      </>
    );
  }

  if (raidLoading || invoiceLoading) {
    return (
      <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
        <Flex direction='column' alignItems='center' w='100%'>
          <Spinner size='xl' mt='150px' />
        </Flex>
      </SiteLayoutPublic>
    );
  }

  if (!raid) {
    return (
      <>
        <NextSeo title='Not Found' />

        <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
          <Page404 />
        </SiteLayoutPublic>
      </>
    );
  }

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
        {!address && (
          <Flex direction='column' alignItems='center'>
            <Text variant='textOne'>{NOT_CONNECTED_MESSAGE}</Text>
          </Flex>
        )}

        {invoiceError && <Text variant='textOne'>Error fetching invoice</Text>}
        {wrongChain && <Text variant='textOne'>{WRONG_NETWORK_MESSAGE}</Text>}

        {invoice && (
          <Flex
            width='100%'
            direction={{ md: 'column', lg: 'row' }}
            alignItems='center'
            justifyContent='space-evenly'
          >
            <Card as={Flex} variant='filled' direction='column' minW='30%'>
              <ProjectInfo raid={raid} direction='column' />
              <InvoiceMetaDetails invoice={invoice} />
            </Card>

            <Flex direction='column' minW='45%'>
              <InvoicePaymentDetails invoice={invoice} />
              <InvoiceButtonManager invoice={invoice} />
            </Flex>
          </Flex>
        )}
      </SiteLayoutPublic>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { raidId: raidIdParam } = _.pick(context.params, ['raidId']);
  const raidId = _.isArray(raidIdParam) ? _.first(raidIdParam) : raidIdParam;

  return {
    props: {
      raidId: raidId || null,
    },
  };
};

export default Escrow;
