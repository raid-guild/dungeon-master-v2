import { useEffect, useState } from 'react';
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
import SiteLayoutPublic from 'components/SiteLayoutPublic';
import { NextSeo } from 'next-seo';
import _ from 'lodash';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useInvoiceDetails } from '@raidguild/escrow-hooks';

// ? slimmer client here? fetch?
export const validateRaidId = async (raidId: string) => {
  const { data } = await axios.post('/api/validate', { raidId });
  return data;
};

const ActionButtons = ({ raid }) => (
  <Stack>
    <Link href='/escrow/new' passHref key='register'>
      <Button variant='outline' isDisabled={!raid || raid.invoiceAddress}>
        Register Escrow
      </Button>
    </Link>
    <Link href={`/escrow/${raid?.id}`} passHref key='view'>
      <Button variant='outline' isDisabled={!raid || !raid.invoiceAddress}>
        View Escrow
      </Button>
    </Link>
  </Stack>
);

export const Escrow = () => {
  const [raidId, setRaidId] = useState('');
  const [validId, setValidId] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (validId === true || validId === false) {
      setValidId(undefined);
    }
  }, [raidId]);

  const localForm = useForm();
  const { watch } = localForm;
  const invoiceId = watch('invoiceId');
  const { data: raid } = useInvoiceDetails(invoiceId);

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
                <ActionButtons raid={raid} />
              </HStack>
            </Flex>
          </Stack>
        </Flex>
      </SiteLayoutPublic>
    </>
  );
};

export default Escrow;
