import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  VStack,
  ControlledInput,
  Heading,
  Button,
  useToast,
  Text,
  Box,
  HStack,
} from '@raidguild/design-system';
import SiteLayout from '../../components/SiteLayout';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useRaidDetail } from '@raidguild/dm-hooks';

import { SmartEscrowContext } from '../../contexts/SmartEscrow';
// import { validateRaidId } from '../utils/requests';

export const Home = () => {
  const { appState, setAppState } = useContext(SmartEscrowContext);
  const [raidId, setRaidId] = useState('');
  const [localRaidId, setLocalRaidId] = useState(
    '8fc39a24-44c9-46a9-b36a-78516b6287ad'
  );
  const [validId, setValidId] = useState(false);
  const [escrowVersion, setEscrowVersion] = useState('Dungeon Master V2');
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ token, raidId });

  const toast = useToast();

  console.log('isRaidIdValid ', raid);

  useEffect(() => {
    if (raid) {
      console.log('setting raid: ', raid);
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

  // const validateIDLocally = async () => {
  //   const result = await validateRaidId({ token, raidId });
  //   console.log('result', result);
  // };

  const validateID = async () => {
    setRaidId(localRaidId);
    // if (raidId === '') return alert('ID cannot be empty!');
    // updateLoadingState();

    // let raid = await validateRaidId(ID, escrowVersion);
    // if (raid) {
    //   setDungeonMasterContext({
    //     invoice_id: raid.invoice_address,
    //     v1_id: raid.v1_id,
    //     raid_id: raid.id,
    //     project_name: raid.name,
    //     client_name: raid.consultation.consultations_contacts[0].contact.name,
    //     start_date: new Date(Number(raid.start_date)) || 'Not Specified',
    //     end_date: new Date(Number(raid.end_date)) || 'Not Specified',
    //     link_to_details: 'Not Specified',
    //     brief_description: 'Not Specified',
    //   });

    //   setValidId(true);
    // } else {
    //   toast.error({
    //     title: 'Raid ID not found or invalid.',
    //     iconName: 'alert',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    // }
    // updateLoadingState();
  };
  console.log('escrow page render: raid: ', raid, 'raidId: ', raidId);

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayout subheader={<Heading>Smart Escrow</Heading>}>
        <VStack width='100%' align='center' maxWidth='400px'>
          <ControlledInput
            type='text'
            value={localRaidId}
            placeholder='Raid ID from Dungeon Master..'
            onChange={(event) => setLocalRaidId(event.target.value)}
            label='Raid ID'
            maxWidth='400px'
          ></ControlledInput>
          {raid ? (
            <Text color='green.500'>Raid ID is valid!</Text>
          ) : !raid ? (
            <Text color='red.500'>Raid ID is not valid!</Text>
          ) : (
            <Box height='30px'></Box>
          )}
          <HStack>
            {raid ? (
              <Link href={`/escrow/${raidId}`} passHref>
                <Button disabled={!raid} variant='outline'>
                  View Escrow
                </Button>
              </Link>
            ) : (
              <Button
                variant='outline'
                onClick={validateID}
                disabled={!localRaidId}
                _hover={{
                  opacity: 0.8,
                }}
              >
                Validate ID
              </Button>
            )}
            <Link href='/escrow/new' passHref>
              <Button variant='outline'>Register Escrow</Button>
            </Link>
          </HStack>
        </VStack>
      </SiteLayout>
    </>
  );
};

export default Home;
