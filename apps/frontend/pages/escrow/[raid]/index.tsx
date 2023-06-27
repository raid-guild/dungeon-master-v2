/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { utils } from 'ethers';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useRaidDetail, useSmartInvoiceAddress } from '@raidguild/dm-hooks';
import { useAccount, useNetwork } from 'wagmi';
import { NextSeo } from 'next-seo';
import SiteLayout from '../../../components/SiteLayout';
import { Heading, Flex, Text } from '@raidguild/design-system';

import { GetServerSidePropsContext } from 'next';
import { SmartEscrowContext } from '../../../contexts/SmartEscrow';

import { ProjectInfo } from '../../../components/SmartEscrow/ProjectInfo';
import { InvoicePaymentDetails } from '../../../components/SmartEscrow/InvoicePaymentDetails';
import { InvoiceMetaDetails } from '../../../components/SmartEscrow/InvoiceMetaDetails';
import { InvoiceButtonManager } from '../../../components/SmartEscrow/InvoiceButtonManager';
import { SUPPORTED_NETWORKS } from '../../../smartEscrow/graphql/client';

import { getInvoice } from '../../../smartEscrow/graphql/getInvoice';
// import { rpcUrls } from '../../../utils/constants';
// import { Page404 } from '../../../shared/Page404';
// import { DM_ENDPOINT, HASURA_SECRET } from '../../../config';
// import {
//   ALL_RAIDS_QUERY,
//   RAID_BY_ID_QUERY,
//   RAID_BY_V1_ID_QUERY,
// } from '../../graphql/queries';

// export const getStaticPaths = async () => {
//   const graphqlQuery = {
//     operationName: 'fetchRaids',
//     query: ALL_RAIDS_QUERY,
//     variables: {}
//   };

//   const { data } = await axios.post(`${DM_ENDPOINT}`, graphqlQuery, {
//     headers: {
//       'x-hasura-admin-secret': HASURA_SECRET
//     }
//   });

//   let raidIds = [];

//   data.data.raids.map((raid) => {
//     raidIds.push(raid.id.toString());
//     raid.v1_id && raidIds.push(raid.v1_id.toString());
//   });
//   console.log(raidIds.length)

//   const paths = raidIds.map((id) => {
//     return {
//       params: { raidId: id }
//     };
//   });

//   return {
//     paths,
//     fallback: true
//   };
// };

// const fetchRaid = async (query, raidId) => {
//   const graphqlQuery = {
//     operationName: 'validateRaidId',
//     query: query,
//     variables: { raidId: raidId },
//   };

//   const { data } = await axios.post(`${DM_ENDPOINT}`, graphqlQuery, {
//     headers: { 'x-hasura-admin-secret': HASURA_SECRET },
//   });

//   return data.data?.raids;
// };

// export const getServerSideProps = async (context) => {
//   const { raidId } = context.params;

//   let raids;
//   if (raidId.includes('-')) {
//     raids = await fetchRaid(RAID_BY_ID_QUERY, raidId);
//   } else {
//     raids = await fetchRaid(RAID_BY_V1_ID_QUERY, raidId);
//   }

//   if (!raids || raids.length === 0) {
//     return {
//       props: {
//         raid: null,
//         escrowValue: null,
//         terminationTime: null,
//       },
//       // revalidate: 1
//     };
//   }

//   let invoice;
//   try {
//     if (raids[0].invoice_address) {
//       let smartInvoice = await getSmartInvoiceAddress(
//         raids[0].invoice_address,
//         new ethers.providers.JsonRpcProvider(rpcUrls[100])
//       );
//       invoice = await getInvoice(100, smartInvoice);
//     }
//   } catch (e) {
//     console.log(e);
//   }

//   return {
//     props: {
//       raid: raids ? raids[0] : null,
//       escrowValue: invoice ? invoice.total : null,
//       terminationTime: invoice ? invoice.terminationTime : null,
//     },
//     // revalidate: 1
//   };
// };

// * use SSR to fetch query params for RQ invalidation
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { raid } = context.params;

  return {
    props: {
      raidId: raid || null,
    },
  };
};

const WRONG_NETWORK_MESSAGE =
  'Wrong network. Please switch to the correct network.';

const Escrow = ({ raidId }) => {
  const { appState, setAppState } = useContext(SmartEscrowContext);
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ raidId, token });
  const { address } = useAccount();
  const { chain } = useNetwork();
  console.log('raidId, token', raidId, token);

  const [invoice, setInvoice] = useState();
  const [invoiceFetchError, setInvoiceFetchError] = useState(false);
  const { data: sIAddress } = useSmartInvoiceAddress({
    invoiceAddress: raid?.invoiceAddress,
  });

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState(
    'Connect your wallet to fetch invoice information.'
  );
  useEffect(() => {
    console.log('sIAddress: ', sIAddress);
  }, [sIAddress]);

  useEffect(() => {
    console.log('useeffect on invoice_id and chain', chain, appState);
    console.log(
      'SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1',
      SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1,
      appState.invoice_id
    );
    if (SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1 && appState.invoice_id) {
      getSmartInvoiceData();
    } else if ((address as string) !== '') {
      console.log(
        'Error 1',
        SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1,
        appState.invoice_id,
        appState
      );
      setInvoiceFetchError(true);
      setStatusText(WRONG_NETWORK_MESSAGE);
    }
  }, [appState.invoice_id, chain]);

  useEffect(() => {
    console.log('raid found, raid: ', raid);
    if (raid) {
      setAppState({
        ...appState,
        invoice_id: raid.invoiceAddress,
        v1_id: raid.v1Id,
        raid_id: raid.id,
        project_name: raid.name,
        client_name:
          raid.consultationByConsultation?.consultationContacts[0]?.contact
            ?.name,
        start_date: new Date(Number(raid.startDate)) || 'Not Specified',
        end_date: new Date(Number(raid.endDate)) || 'Not Specified',
        link_to_details: 'Not Specified',
        brief_description: 'Not Specified',
      });
      // setInvoiceAddress(raid.invoiceAddress);
    } else {
      // todo: display toast with no raid found message
    }
  }, [raid]);

  console.log('sIAddress render: ', sIAddress);
  console.log('[raid] index render. appState: ', appState);
  console.log('raid?.invoiceAddress ', raid?.invoiceAddress);

  // todo: handle escrowValue definition
  const escrowValue = 10;
  // get from invoice.terminationTime
  const terminationTime = new Date();

  const [validRaid, setValidRaid] = useState(true);

  console.log(chain, 'chain');
  console.log(raid, 'raid');

  // useEffect(() => {
  //   if (raid) {
  //     context.setDungeonMasterContext({
  //       invoice_id: raid.invoice_address,
  //       v1_id: raid.v1_id,
  //       raid_id: raid.id,
  //       project_name: raid.name,
  //       client_name: raid.consultation.consultations_contacts[0].contact.name,
  //       start_date: new Date(Number(raid.start_date)) || 'Not Specified',
  //       end_date: new Date(Number(raid.end_date)) || 'Not Specified',
  //       link_to_details: 'Not Specified',
  //       brief_description: 'Not Specified'
  //     });

  //     if (raid.invoice_address) {
  //       setValidRaid(true);
  //     }
  //   }
  // }, []);

  const getSmartInvoiceData = async () => {
    try {
      console.log(
        'inside getsmart invoice data',
        utils.isAddress(appState.invoice_id)
      );
      if (
        utils.isAddress(appState.invoice_id)
        // !Number.isNaN(parseInt(chain))
        // todo: check that this conditional is not needed
      ) {
        setLoading(true);
        setStatusText('Fetching Smart Invoice Data..');

        const invoice = await getInvoice(chain.id, appState.invoice_id);
        console.log('fetched invoice: ', invoice);
        if (invoice) {
          setInvoice(invoice);
          setInvoiceFetchError(false);
          setLoading(false);
        } else {
          console.log('Error, invoice not found');
          setInvoiceFetchError(true);
          setStatusText(
            `Something went wrong. Smart Invoice with address ${appState.invoice_id} was not found.`
          );
          setLoading(false);
        }
      }
    } catch (err) {
      console.log('Error 2');
      console.log(err);
      setInvoiceFetchError(true);
      setStatusText(WRONG_NETWORK_MESSAGE);
      setLoading(false);
    }
  };

  console.log('escrowValue && raid', escrowValue && raid, escrowValue, raid);
  console.log(
    'invoice && !loading && chain?.id == 100',
    invoice && !loading && chain?.id == 100
  );
  console.log('address, invoiceFetchError', address, invoiceFetchError);
  console.log(
    'Escrow detail page render, appState, invoice: ',
    appState,
    invoice
  );
  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayout subheader={<Heading>Smart Escrow</Heading>}>
        <Flex w='100%' h='100%' justifyContent='center'>
          {validRaid ? (
            <>
              {!address && (
                <Flex direction='column' alignItems='center'>
                  <Text variant='textOne'>{statusText}</Text>
                </Flex>
              )}

              {invoiceFetchError && <Text variant='textOne'>{statusText}</Text>}

              {invoice &&
                !loading &&
                SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1 && (
                  <Flex
                    width='100%'
                    direction={{ md: 'column', lg: 'row' }}
                    alignItems='center'
                    justifyContent='space-evenly'
                  >
                    <Flex direction='column' minW='30%'>
                      <ProjectInfo appState={appState} />
                      <InvoiceMetaDetails invoice={invoice} />
                    </Flex>

                    <Flex direction='column' minW='45%'>
                      <InvoicePaymentDetails
                        web3={appState.web3}
                        invoice={invoice}
                        chainId={chain.id}
                        provider={appState.provider}
                      />
                      <InvoiceButtonManager
                        invoice={invoice}
                        account={address}
                        provider={appState.provider}
                        wrappedAddress={appState.invoice_id}
                      />
                    </Flex>
                  </Flex>
                )}
            </>
          ) : (
            // <Page404 />
            <div>page not found</div>
          )}
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Escrow;
