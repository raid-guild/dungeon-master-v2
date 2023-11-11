import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ControlledInput,
  Heading,
  Button,
  Text,
  Box,
  Stack,
  HStack,
  Flex,
} from '@raidguild/design-system';

import SiteLayoutPublic from '../../components/SiteLayoutPublic';
import { NextSeo } from 'next-seo';
import _ from 'lodash';
import axios from 'axios';
import { SmartEscrowContext } from '../../contexts/SmartEscrow';

// ? slimmer client here? fetch?
export const validateRaidId = async (raidId: string) => {
  const { data } = await axios.post('/api/validate', { raidId });
  return data;
};

export const Escrow = () => {
  const { appState, setAppState } = useContext(SmartEscrowContext);
  const [raidId, setRaidId] = useState('');
  const [validId, setValidId] = useState<boolean | undefined>(undefined);
  const [raid, setRaid] = useState<any>();

  useEffect(() => {
    if (validId === true || validId === false) {
      setValidId(undefined);
    }
  }, [raidId]);

  const validateID = async () => {
    const raid = await validateRaidId(raidId);
    setRaid(raid);

    if (raid) {
      setValidId(true);

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
  const renderActionButton = () => {
    const buttons = [];
    buttons.push(
      <Button
        variant='outline'
        onClick={validateID}
        disabled={!raidId}
        _hover={{
          opacity: 0.8,
        }}
        mb='4'
        key='validate'
      >
        Validate ID
      </Button>
    );
    if (validId === true && raid && !raid.invoice_address) {
      buttons.push(
        <Link href='/escrow/new' passHref key='register'>
          <Button variant='outline' mb='4'>
            Register Escrow
          </Button>
        </Link>
      );
    } else if (validId === true && raid && raid.invoice_address) {
      buttons.push(
        <Link href={`/escrow/${raidId}`} passHref key='view'>
          <Button disabled={!raid} variant='outline' mb='4'>
            View Escrow
          </Button>
        </Link>
      );
    }
    return buttons;
  };

  const renderValidationMessage = () => {
    if (validId === true) {
      return (
        <Text color='green.500' mb='2'>
          Raid ID is valid!
        </Text>
      );
    } else if (validId === false) {
      return (
        <Text color='primary.300' mb='2'>
          Raid ID is not valid!
        </Text>
      );
    } else {
      return <Box height='30px' mb='2'></Box>;
    }
  };

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayoutPublic
        subheader={<Heading>Smart Escrow</Heading>}
        minHeight={[null, null, '100vh']}
      >
        <Flex justify='center' width='100%'>
          <Stack spacing={4}>
            <ControlledInput
              type='text'
              value={raidId}
              placeholder='Raid ID from Dungeon Master..'
              onChange={(event) => setRaidId(event.target.value)}
              label='Raid ID'
              width={['300px', '500px']}
              borderColor='whiteAlpha.600'
              borderRadius='md'
            />
            <Flex justify='flex-end'>
              <HStack>
                {renderValidationMessage()}
                {renderActionButton()}
              </HStack>
            </Flex>
          </Stack>
        </Flex>
      </SiteLayoutPublic>
    </>
  );
};

export default Escrow;
