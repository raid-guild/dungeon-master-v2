import { Flex, Heading, Text } from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { useInvoiceDetails } from '@raidguild/escrow-hooks';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import SiteLayoutPublic from '../../components/SiteLayoutPublic';
import InvoiceButtonManager from '../../components/SmartEscrow/InvoiceButtonManager';
import InvoiceMetaDetails from '../../components/SmartEscrow/InvoiceMetaDetails';
import InvoicePaymentDetails from '../../components/SmartEscrow/InvoicePaymentDetails';
import ProjectInfo from '../../components/SmartEscrow/ProjectInfo';
import Page404 from '../../components/SmartEscrow/shared/Page404';

// const WRONG_NETWORK_MESSAGE =
//   'This network is not supported: Switch to Gnosis Network';

const Escrow = ({ raidId }: { raidId: string }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  // const [invoiceFetchError, setInvoiceFetchError] = useState(false);
  // const [invoice, setInvoice] = useState<Invoice | undefined>();

  const [statusText, setStatusText] = useState<any>(
    'Connect your wallet to fetch invoice information.'
  );

  const { data: raid } = useRaidDetail({ raidId, token });

  // useEffect(() => {
  //   if (raid) {
  //     setAppState({
  //       ...appState,
  //       invoice_id: raid.invoice_address,
  //       v1_id: raid.v1Id,
  //       raid_id: raid.id,
  //       project_name: raid.name,
  //       client_name:
  //         raid.consultationByConsultation?.consultationContacts[0]?.contact
  //           ?.name,
  //       start_date: new Date(Number(raid.startDate)) || 'Not Specified',
  //       end_date: new Date(Number(raid.endDate)) || 'Not Specified',
  //       link_to_details: 'Not Specified',
  //       brief_description: 'Not Specified',
  //     });

  //     if (SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1) {
  //       getSmartInvoiceData();
  //     } else if ((address as string) !== '') {
  //       setInvoiceFetchError(true);
  //       setStatusText(WRONG_NETWORK_MESSAGE);
  //     }
  //   } else {
  //     setValidRaid(false);
  //   }
  // }, []);

  const { data: invoice, error: invoiceError } = useInvoiceDetails({
    invoiceAddress: raid?.invoiceAddress,
    chainId: chain?.id,
  });
  console.log(invoice);

  // const getSmartInvoiceData = async () => {
  //   try {
  //     if (raid.invoiceAddress) {
  //       const currInvoice = await getInvoice(chain.id, raid.invoiceAddress);
  //       if (!currInvoice) {
  //         setInvoiceFetchError(true);
  //         setStatusText(
  //           <VStack>
  //             <Text>
  //               Data for invoice with address {raid.invoiceAddress} was not
  //               found.
  //             </Text>
  //             <Text>
  //               If it was created before August 2023, try looking in the V1 App{' '}
  //               <Link
  //                 href={`https://smartescrow.raidguild.org/escrow/${
  //                   raid && raid.id
  //                 }`}
  //                 target='_blank'
  //                 isExternal
  //                 color='primary.300'
  //                 textDecoration='underline'
  //               >
  //                 here
  //               </Link>
  //             </Text>
  //           </VStack>
  //         );
  //       } else {
  //         setInvoice(currInvoice);
  //       }
  //     }
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error(e);
  //   }
  // };

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
        {raid ? (
          <>
            {!address && (
              <Flex direction='column' alignItems='center'>
                <Text variant='textOne'>{statusText}</Text>
              </Flex>
            )}

            {invoiceError && <Text variant='textOne'>{statusText}</Text>}

            {invoice && (
              <Flex
                width='100%'
                direction={{ md: 'column', lg: 'row' }}
                alignItems='center'
                justifyContent='space-evenly'
              >
                <Flex direction='column' minW='30%'>
                  <ProjectInfo raid={raid} />
                  <InvoiceMetaDetails invoice={invoice} />
                </Flex>

                <Flex direction='column' minW='45%'>
                  <InvoicePaymentDetails invoice={invoice} />
                  <InvoiceButtonManager invoice={invoice} account={address} />
                </Flex>
              </Flex>
            )}
          </>
        ) : (
          <Page404 />
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
