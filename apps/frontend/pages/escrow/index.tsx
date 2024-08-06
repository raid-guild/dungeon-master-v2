import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
} from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import { unsupportedNetwork } from '@raidguild/escrow-gql';
// import axios from 'axios';
import _ from 'lodash';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useForm } from 'react-hook-form';
import { useChainId, useSwitchNetwork } from 'wagmi';
import { optimism } from 'wagmi/chains';

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

  const chainId = useChainId();
  const { switchNetwork } = useSwitchNetwork();
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
      <NextSeo title='Escrow' />

      <SiteLayoutPublic
        subheader={<Heading>Escrow</Heading>}
        minHeight={[null, null, '100vh']}
      >
        {chainId === 1 && (
          <Alert
            flexDirection='column'
            gap={6}
            mb='4'
            p={8}
            status='warning'
            textAlign='center'
          >
            <AlertIcon boxSize='40px' />
            <Text>
              You are currently on the Mainnet chain. Please note that all
              escrows created here get released to a pre-existing RaidGuild
              multi-sig, rather than the DAO.
            </Text>
          </Alert>
        )}
        {chainId === 10 && (
          <Alert
            flexDirection='column'
            gap={6}
            mb='4'
            p={8}
            status='warning'
            textAlign='center'
          >
            <AlertIcon boxSize='40px' />
            <Text>
              You are currently on the Optimism chain. All escrows created here
              are released to the RaidGuild&apos;s Optimism DAO, which is a
              completely separate entity from the RaidGuild&apos;s Gnosis DAO.
              By creating an escrow here, you will be required to only use
              native USDC, and may be required to KYC. All spoils will go
              towards supporting the RaidGuild&apos;s Optimism DAO effort. To
              read more about this effort, please visit the{' '}
              <ChakraLink
                color='red'
                isExternal
                href='https://handbook.raidguild.org/docs/raids/escrow/how-does-it-work'
                _hover={{
                  textDecoration: 'underline',
                }}
              >
                handbook
              </ChakraLink>
              .
            </Text>
          </Alert>
        )}
        <Flex justify='center' width='100%'>
          {unsupportedNetwork(chainId) ? (
            <Card variant='filled'>
              <CardBody>
                <Text>
                  RaidGuild currently does not support raids on this chain.
                  Please switch to the Gnosis or Optimism chain.
                </Text>
              </CardBody>

              <CardFooter w='100%'>
                <HStack justifyContent='center' w='100%'>
                  <Button onClick={() => switchNetwork(100)}>
                    <HStack spacing={2} align='center'>
                      <Image
                        alt={optimism.name ?? 'Chain icon'}
                        src='/icons/gnosis-light.png'
                        boxSize='20px'
                      />
                      <Text>Gnosis</Text>
                    </HStack>
                  </Button>
                  <Button onClick={() => switchNetwork(10)}>
                    <HStack spacing={2} align='center'>
                      <Image
                        alt={optimism.name ?? 'Chain icon'}
                        src='/icons/optimism.png'
                        boxSize='25px'
                      />
                      <Text>Optimism</Text>
                    </HStack>
                  </Button>
                </HStack>
              </CardFooter>
            </Card>
          ) : (
            <Card variant='filled'>
              <CardBody>
                <Input
                  name='raidId'
                  label='Raid ID'
                  placeholder='Raid ID from Dungeon Master..'
                  width={['300px', '500px']}
                  borderColor='whiteAlpha.600'
                  borderRadius='md'
                  localForm={localForm}
                />
              </CardBody>

              <CardFooter w='100%'>
                <Flex justify='flex-end' w='100%'>
                  <Stack>
                    <ActionButtons raid={raid} />
                    {raidId && !isLoading && (
                      <Text color={raid ? 'green.500' : 'red.500'} mb='2'>
                        {raid ? 'Raid ID is valid!' : 'Raid not found'}
                      </Text>
                    )}
                  </Stack>
                </Flex>
              </CardFooter>
            </Card>
          )}
        </Flex>
      </SiteLayoutPublic>
    </>
  );
};

export default Escrow;
