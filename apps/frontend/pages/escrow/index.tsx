import {
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
// import axios from 'axios';
import _ from 'lodash';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useForm } from 'react-hook-form';

import SiteLayoutPublic from '../../components/SiteLayoutPublic';

// ? move to helper/escrow-gql
// export const validateRaidId = async (raidId: string) => {
//   console.log(raidId);
//   const { data } = await axios.post('/api/validate', { raidId });
//   console.log(data);
//   return data;
// };

// 7b733a60-03b7-472e-8157-c40563c1adaf

const ActionButtons = ({ raid }: { raid: IRaid }) => (
  <HStack>
    {raid ? (
      <>
        <Link href={`/escrow/new?raidId=${raid?.id}`} passHref key='register'>
          <Button
            variant='outline'
            isDisabled={!raid || !!raid?.invoiceAddress}
          >
            Register Escrow
          </Button>
        </Link>
        <Link href={`/escrow/${raid?.id}`} passHref key='view'>
          <Button variant='outline' isDisabled={!raid?.invoiceAddress}>
            View Escrow
          </Button>
        </Link>
      </>
    ) : (
      <Link href='/escrow/new'>
        <Button variant='outline'>I don&apos;t have one</Button>
      </Link>
    )}
  </HStack>
);

export const Escrow = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const localForm = useForm();
  const { watch } = localForm;
  const raidId = watch('raidId');

  const { data: raid, isLoading } = useRaidDetail({
    raidId,
    token,
    roles: _.get(session, 'user.roles'),
  });

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayoutPublic
        subheader={<Heading>Smart Escrow</Heading>}
        minHeight={[null, null, '100vh']}
      >
        <Flex justify='center' width='100%'>
          <Stack spacing={4}>
            <Input
              name='raidId'
              label='Raid ID'
              placeholder='Raid ID from Dungeon Master..'
              width={['300px', '500px']}
              borderColor='whiteAlpha.600'
              borderRadius='md'
              localForm={localForm}
            />
            <Flex justify='flex-end'>
              <Stack>
                <ActionButtons raid={raid} />
                {raidId && !isLoading && (
                  <Text color={raid ? 'green.500' : 'red.500'} mb='2'>
                    {raid ? 'Raid ID is valid!' : 'Raid not found'}
                  </Text>
                )}
              </Stack>
            </Flex>
          </Stack>
        </Flex>
      </SiteLayoutPublic>
    </>
  );
};

export default Escrow;
