/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { RAID_BY_ID_QUERY, RAID_BY_V1_ID_QUERY } from '@raidguild/dm-graphql';
import { useAccount, useNetwork } from 'wagmi';
import { NextSeo } from 'next-seo';
import SiteLayoutPublic from '../../../components/SiteLayoutPublic';
import { Heading, Flex, Text, VStack } from '@raidguild/design-system';
import axios from 'axios';

import { SmartEscrowContext } from '../../../contexts/SmartEscrow';
import { Page404 } from '../../../components/SmartEscrow/shared/Page404';

import { ProjectInfo } from '../../../components/SmartEscrow/ProjectInfo';
import { InvoicePaymentDetails } from '../../../components/SmartEscrow/InvoicePaymentDetails';
import { InvoiceMetaDetails } from '../../../components/SmartEscrow/InvoiceMetaDetails';
import { InvoiceButtonManager } from '../../../components/SmartEscrow/InvoiceButtonManager';
import { SUPPORTED_NETWORKS } from '../../../smartEscrow/graphql/client';
import Link from '../../../components/ChakraNextLink';

import { getInvoice } from '../../../smartEscrow/graphql/getInvoice';

const DM_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
const WRONG_NETWORK_MESSAGE =
  'This network is not supported: Switch to Gnosis Network';

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

export const getServerSideProps = async (context) => {
  const { raidId } = context.params;

  let raids;
  if (raidId && raidId.includes('-')) {
    raids = await fetchRaid(RAID_BY_ID_QUERY, raidId);
  } else {
    raids = await fetchRaid(RAID_BY_V1_ID_QUERY, raidId);
  }

  if (!raids || raids.length === 0) {
    return {
      props: {
        raid: null,
      },
      // revalidate: 1
    };
  }

  return {
    props: {
      raid: raids ? raids[0] : null,
    },
  };
};

const Escrow = ({ raid }) => {
  const { appState, setAppState } = useContext(SmartEscrowContext);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [invoiceFetchError, setInvoiceFetchError] = useState(false);
  const [invoice, setInvoice] = useState();

  const [statusText, setStatusText] = useState<any>(
    'Connect your wallet to fetch invoice information.'
  );
  const [validRaid, setValidRaid] = useState(true);

  useEffect(() => {
    if (raid) {
      setAppState({
        ...appState,
        invoice_id: raid.invoice_address,
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

      if (SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1) {
        getSmartInvoiceData();
      } else if ((address as string) !== '') {
        setInvoiceFetchError(true);
        setStatusText(WRONG_NETWORK_MESSAGE);
      }
    } else {
      setValidRaid(false);
    }
  }, []);

  const getSmartInvoiceData = async () => {
    try {
      if (raid.invoice_address) {
        const currInvoice = await getInvoice(chain.id, raid.invoice_address);
        if (!currInvoice) {
          setInvoiceFetchError(true);
          setStatusText(
            <VStack>
              <Text>
                Data for invoice with address {raid.invoice_address} was not
                found.
              </Text>
              <Text>
                If it was created before August 2023, try looking in the V1 App{' '}
                <Link
                  href={`https://smartescrow.raidguild.org/escrow/${
                    raid && raid.id
                  }`}
                  target={'_blank'}
                  isExternal
                  color='primary.300'
                  textDecoration='underline'
                >
                  here
                </Link>
              </Text>
            </VStack>
          );
        } else {
          setInvoice(currInvoice);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
        {validRaid ? (
          <>
            {!address && (
              <Flex direction='column' alignItems='center'>
                <Text variant='textOne'>{statusText}</Text>
              </Flex>
            )}

            {invoiceFetchError && <Text variant='textOne'>{statusText}</Text>}

            {invoice && SUPPORTED_NETWORKS.indexOf(chain?.id) !== -1 && (
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
                    invoice={invoice}
                    chainId={chain.id}
                    provider={appState.provider}
                  />
                  <InvoiceButtonManager
                    invoice={invoice}
                    account={address}
                    provider={appState.provider}
                  />
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

export default Escrow;
