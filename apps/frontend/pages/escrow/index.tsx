import { useContext, useState } from 'react';
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
import { useRaidValidate } from '@raidguild/dm-hooks';

import { SmartEscrow } from '../../contexts/SmartEscrow';
// import { validateRaidId } from '../utils/requests';

export const Home = () => {
  const context = useContext(SmartEscrow);
  const [raidId, setRaidId] = useState('');
  const [localRaidId, setLocalRaidId] = useState('');
  const [validId, setValidId] = useState(false);
  const [escrowVersion, setEscrowVersion] = useState('Dungeon Master V2');
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: isRaidIdValid } = useRaidValidate({ token, raidId });

  const toast = useToast();

  console.log('isRaidIdValid ', isRaidIdValid);

  // useEffect(() => {
  //   if (raidId) {
  //     validateIDLocally();
  //   }
  // }, [raidId]);

  // const validateIDLocally = async () => {
  //   const result = await validateRaidId({ token, raidId });
  //   console.log('result', result);
  // };

  const validateID = async () => {
    setRaidId(localRaidId);
    // if (raidId === '') return alert('ID cannot be empty!');
    // context.updateLoadingState();

    // let raid = await validateRaidId(ID, escrowVersion);
    // if (raid) {
    //   context.setDungeonMasterContext({
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
    // context.updateLoadingState();
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
          {isRaidIdValid ? (
            <Text color='green.500'>Raid ID is valid!</Text>
          ) : isRaidIdValid === false ? (
            <Text color='red.500'>Raid ID is not valid!</Text>
          ) : (
            <Box height='30px'></Box>
          )}
          <HStack>
            {isRaidIdValid === true ? (
              <Link href={`/escrow/${raidId}`} passHref>
                <Button disabled={!isRaidIdValid} variant='outline'>
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
