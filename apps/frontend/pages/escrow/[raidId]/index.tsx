/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ethers, utils } from 'ethers';
// import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useRaidDetail } from '@raidguild/dm-hooks';

import { GetServerSidePropsContext } from 'next';
import axios from 'axios';
import Head from 'next/head';

import { SmartEscrowContext } from '../../../contexts/SmartEscrow';

import { ProjectInfo } from '../../../components/SmartEscrow/ProjectInfo';
// import { InvoicePaymentDetails } from '../../../components/SmartEscrow/InvoicePaymentDetails';
// import { InvoiceMetaDetails } from '../../../components/SmartEscrow/InvoiceMetaDetails';
// import { InvoiceButtonManager } from '../../../components/SmartEscrow/InvoiceButtonManager';

import { getInvoice } from '../../../graphql/getInvoice';
import {
  getSmartInvoiceAddress,
  getRaidPartyAddress,
} from '../../../utils/invoice';
import { rpcUrls } from '../../../utils/constants';
import { Page404 } from '../../../shared/Page404';
import { DM_ENDPOINT, HASURA_SECRET } from '../../../config';
import {
  ALL_RAIDS_QUERY,
  RAID_BY_ID_QUERY,
  RAID_BY_V1_ID_QUERY,
} from '../../graphql/queries';

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

const fetchRaid = async (query, raidId) => {
  const graphqlQuery = {
    operationName: 'validateRaidId',
    query: query,
    variables: { raidId: raidId },
  };

  const { data } = await axios.post(`${DM_ENDPOINT}`, graphqlQuery, {
    headers: { 'x-hasura-admin-secret': HASURA_SECRET },
  });

  return data.data?.raids;
};

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

const Escrow = ({ raidId }) => {
  const context = useContext(SmartEscrowContext);
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ raidId, token });

  const [invoice, setInvoice] = useState();
  const [raidParty, setRaidParty] = useState('');
  const [invoiceFetchError, setInvoiceFetchError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState(
    'Connect your wallet to fetch invoice information.'
  );

  const [validRaid, setValidRaid] = useState(false);

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

  // const getSmartInvoiceData = async () => {
  //   try {
  //     if (
  //       utils.isAddress(context.invoice_id) &&
  //       !Number.isNaN(parseInt(context.chainID))
  //     ) {
  //       setLoading(true);
  //       setStatusText('Fetching Smart Invoice from Wrapped Invoice..');
  //       let smartInvoice = await getSmartInvoiceAddress(
  //         context.invoice_id,
  //         context.provider
  //       );

  //       const invoice = await getInvoice(
  //         parseInt(context.chainID),
  //         smartInvoice
  //       );
  //       setInvoice(invoice);
  //       setInvoiceFetchError(false);
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setInvoiceFetchError(true);
  //     setStatusText('Wrong network. Please switch to the correct network.');
  //     setLoading(false);
  //   }
  // };

  // const fetchRaidPartyAddress = async () => {
  //   if (invoice) {
  //     let addr = await getRaidPartyAddress(invoice.provider, context.provider);
  //     setRaidParty(addr);
  //   }
  // };

  // useEffect(() => {
  //   if (Number(context.chainID) == 100) {
  //     if (context.invoice_id) {
  //       getSmartInvoiceData();
  //     }
  //   } else if (context.account !== '') {
  //     setInvoiceFetchError(true);
  //     setStatusText('Wrong network. Please switch to the correct network.');
  //   }
  // }, [context.invoice_id, context.chainID]);

  // useEffect(() => {
  //   fetchRaidPartyAddress();
  // }, [invoice]);

  return (
    <Flex w='100%' h='100%' justifyContent='center'>
      {escrowValue && (
        <Head>
          <title>{raid.raid_name}</title>
          <meta property='og:title' content={raid.raid_name} />
          <meta
            property='og:image'
            content={`https://smartescrow.raidguild.org/api/og?projectName=${
              raid.raid_name
            }&escrowValue=${Number(utils.formatEther(escrowValue)).toFixed(
              0
            )}&safetyValveDate=${terminationTime}`}
          />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content={raid.name} />
          <meta
            name='twitter:image'
            content={`https://smartescrow.raidguild.org/api/og?projectName=${
              raid.raid_name
            }&escrowValue=${Number(utils.formatEther(escrowValue)).toFixed(
              0
            )}&safetyValveDate=${terminationTime}`}
          />
          <meta property='og:type' content='website' />
        </Head>
      )}

      {validRaid ? (
        <>
          {context.account === '' && (
            <Flex direction='column' alignItems='center'>
              <Text variant='textOne'>{statusText}</Text>
            </Flex>
          )}

          {invoiceFetchError && <Text variant='textOne'>{statusText}</Text>}

          {invoice && !loading && Number(context.chainID) == 100 && (
            <Flex
              width='100%'
              direction={{ md: 'column', lg: 'row' }}
              alignItems='center'
              justifyContent='space-evenly'
            >
              <Flex direction='column' minW='30%'>
                <ProjectInfo context={context} />
                {/* <InvoiceMetaDetails invoice={invoice} raidParty={raidParty} /> */}
              </Flex>

              <Flex direction='column' minW='45%'>
                {/* <InvoicePaymentDetails
                  web3={context.web3}
                  invoice={invoice}
                  chainID={context.chainID}
                  provider={context.provider}
                />

                <InvoiceButtonManager
                  invoice={invoice}
                  account={context.account}
                  provider={context.provider}
                  raidParty={raidParty}
                  wrappedAddress={context.invoice_id}
                /> */}
              </Flex>
            </Flex>
          )}
        </>
      ) : (
        <Page404 />
      )}
    </Flex>
  );
};

export default Escrow;
