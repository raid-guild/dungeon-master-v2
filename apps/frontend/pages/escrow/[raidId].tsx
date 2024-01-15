import {
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
} from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { SUPPORTED_NETWORKS } from '@raidguild/escrow-gql';
import { useInvoiceDetails, useSplitsMetadata } from '@raidguild/escrow-hooks';
import { invoiceUrl } from '@raidguild/escrow-utils';
import _ from 'lodash';
import type { GetServerSidePropsContext } from 'next';
import { getServerSession, SessionOptions } from 'next-auth';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useAccount, useNetwork } from 'wagmi';

import ChakraNextLink from '../../components/ChakraNextLink';
import InvoiceButtonManager from '../../components/Escrow/InvoiceButtonManager';
import InvoiceMetaDetails from '../../components/Escrow/InvoiceMetaDetails';
import InvoicePaymentDetails from '../../components/Escrow/InvoicePaymentDetails';
import ProjectInfo from '../../components/Escrow/ProjectInfo';
import ReceiverSplits from '../../components/Escrow/ReceiverSplits';
import Page404 from '../../components/Escrow/shared/Page404';
import SiteLayoutPublic from '../../components/SiteLayoutPublic';
import { authOptions } from '../api/auth/[...nextauth]';

const WRONG_NETWORK_MESSAGE =
  'This network is not supported: Switch to Gnosis Chain';
const NOT_CONNECTED_MESSAGE =
  'Connect your wallet to fetch invoice information.';

const Escrow = ({
  raidId,
  serverSession,
}: {
  raidId: string;
  serverSession: SessionOptions;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: session } = useSession() || { data: serverSession };
  const token = _.get(session, 'token');

  const { data: raid, isLoading: raidLoading } = useRaidDetail({
    raidId,
    token,
    roles: _.get(session, 'user.roles'),
  });

  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useInvoiceDetails({
    invoiceAddress: raid?.invoiceAddress,
    chainId: 100, // chain?.id, // ! support multiple chains
  });

  const initialSplit = useMemo(
    () => [_.get(invoice, 'providerReceiver')],
    [invoice]
  );

  const { data: initialSplitMetadata, isLoading: initialSplitIsLoading } =
    useSplitsMetadata({
      splits: initialSplit,
      chainId: chain?.id,
    });

  const wrongChain = !_.includes(SUPPORTED_NETWORKS, chain?.id);

  if (!token && !invoice) {
    return (
      <SiteLayoutPublic subheader={<Heading>Escrow</Heading>}>
        <Flex direction='column' alignItems='center' w='100%' pt='150px'>
          <Heading size='md'>Connect your wallet & Sign in</Heading>
        </Flex>
      </SiteLayoutPublic>
    );
  }

  if ((raidLoading || invoiceLoading) && !invoice) {
    return (
      <SiteLayoutPublic subheader={<Heading>Escrow</Heading>}>
        <Flex direction='column' alignItems='center' w='100%'>
          <Spinner size='xl' mt='150px' />
        </Flex>
      </SiteLayoutPublic>
    );
  }

  if ((!raid || (raid && raid.invoiceAddress && !invoice)) && !invoice) {
    return (
      <SiteLayoutPublic subheader={<Heading>Escrow</Heading>}>
        <Page404
          heading='Invoice not found!'
          primaryLink={{ link: '/escrow', label: 'Back to escrow' }}
        />
      </SiteLayoutPublic>
    );
  }

  return (
    <>
      <NextSeo title='Escrow' />

      <SiteLayoutPublic subheader={<Heading>Escrow</Heading>}>
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
            direction={{ base: 'column', lg: 'row' }}
            // alignItems='center'
            justifyContent='space-evenly'
          >
            <Stack spacing={4}>
              <Card
                as={Flex}
                variant='filled'
                direction='column'
                minW={{ base: '90%', lg: '30%' }}
              >
                <Stack>
                  <ProjectInfo raid={raid} direction='column' />
                  <InvoiceMetaDetails
                    invoice={invoice}
                    receiverIsSplit={
                      !_.isEmpty(_.compact(initialSplitMetadata))
                    }
                  />
                  <Flex justify='flex-end'>
                    <ChakraNextLink
                      href={invoiceUrl(chain?.id || 100, invoice?.id)}
                    >
                      <HStack>
                        <Text fontSize='xs' textTransform='uppercase'>
                          smartinvoice.xyz
                        </Text>
                        <Icon
                          as={FaExternalLinkAlt}
                          color='purple.400'
                          boxSize='0.55rem'
                        />
                      </HStack>
                    </ChakraNextLink>
                  </Flex>
                </Stack>
              </Card>
              <ReceiverSplits
                initialSplitMetadata={_.first(initialSplitMetadata)}
                chainId={chain?.id}
                isLoading={initialSplitIsLoading}
              />
            </Stack>

            <Flex direction='column' minW='45%' mt={{ base: 4, lg: 0 }}>
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

  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      raidId: raidId || null,
      serverSession: session,
    },
  };
};

export default Escrow;
