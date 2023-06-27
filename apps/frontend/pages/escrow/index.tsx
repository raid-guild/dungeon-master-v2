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
    '7bc41434-494f-4a0b-a938-b00eeec4ee99'
  );
  const [validId, setValidId] = useState<boolean | undefined>(undefined);
  const [escrowVersion, setEscrowVersion] = useState('Dungeon Master V2');
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ token, raidId });

  const toast = useToast();

  console.log('raid render: raid: ', raid);

  useEffect(() => {
    if (raid && Object.keys(raid).length > 0) {
      setValidId(true);

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
  const renderActionButton = () => {
    if (validId === true && raid && !raid.invoiceAddress) {
      return (
        <Link href='/escrow/new' passHref>
          <Button variant='outline'>Register Escrow</Button>
        </Link>
      );
    } else if (validId === false || validId === undefined) {
      return (
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
      );
    } else if (validId === true && raid && raid.invoiceAddress) {
      return (
        <Link href={`/escrow/${raidId}`} passHref>
          <Button disabled={!raid} variant='outline'>
            View Escrow
          </Button>
        </Link>
      );
    }
  };

  const renderValidationMessage = () => {
    if (validId === true) {
      return <Text color='green.500'>Raid ID is valid!</Text>;
    } else if (validId === false) {
      return <Text color='primary.300'>Raid ID is not valid!</Text>;
    } else {
      return <Box height='30px'></Box>;
    }
  };

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
          {renderValidationMessage()}
          <HStack>{renderActionButton()}</HStack>
        </VStack>
      </SiteLayout>
    </>
  );
};

export default Home;
