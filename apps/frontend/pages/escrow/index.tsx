import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ControlledInput,
  Heading,
  Button,
  useToast,
  Text,
  Box,
  Flex,
} from '@raidguild/design-system';

import SiteLayoutPublic from '../../components/SiteLayoutPublic';
import { NextSeo } from 'next-seo';
import _ from 'lodash';
import axios from 'axios';
import { SmartEscrowContext } from '../../contexts/SmartEscrow';

export const validateRaidId = async (raidId: string) => {
  const { data } = await axios.post('/api/validate', { raidId });
  return data;
};

export const Home = () => {
  const { appState, setAppState } = useContext(SmartEscrowContext);
  const [raidId, setRaidId] = useState('');
  const [validId, setValidId] = useState<boolean | undefined>(undefined);
  const [raid, setRaid] = useState();

  useEffect(() => {
    if (validId === true || validId === false) {
      setValidId(undefined);
    }
  }, [raidId]);

  console.log('raid render: raid: ', raid);

  const validateID = async () => {
    const raid = await validateRaidId(raidId);
    setRaid(raid);
    console.log('got raid: ', raid);

    if (raid) {
      setValidId(true);

      console.log('setting raid: ', raid);
      setAppState({
        ...appState,
        invoice_id: raid.invoice_address,
        v1_id: raid.v1_id,
        raid_id: raid.id,
        project_name: raid.name,
        client_name:
          raid.consultationByConsultation?.consultationContacts[0]?.contact
            ?.name,
        start_date: new Date(Number(raid.start_date)) || 'Not Specified',
        end_date: new Date(Number(raid.end_date)) || 'Not Specified',
        link_to_details: 'Not Specified',
        brief_description: 'Not Specified',
      });
    } else {
      setValidId(false);
    }
  };
  console.log('escrow page render: raid: ', raid, 'raidId: ', raidId);
  const renderActionButton = () => {
    if (validId === true && raid && !raid.invoice_address) {
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
          disabled={!raidId}
          _hover={{
            opacity: 0.8,
          }}
        >
          Validate ID
        </Button>
      );
    } else if (validId === true && raid && raid.invoice_address) {
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
    console.log('validId ', validId);
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

      <SiteLayoutPublic subheader={<Heading>Smart Escrow</Heading>}>
        <Flex directin='column'>
          <Flex width='100%' align='center' maxWidth='400px' mt='6'>
            <ControlledInput
              type='text'
              value={raidId}
              placeholder='Raid ID from Dungeon Master..'
              onChange={(event) => setRaidId(event.target.value)}
              label='Raid ID'
              maxWidth='400px'
            ></ControlledInput>
            {renderValidationMessage()}
          </Flex>
          {renderActionButton()}
        </Flex>
      </SiteLayoutPublic>
    </>
  );
};

export default Home;
