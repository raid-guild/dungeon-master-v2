import {
  Button,
  Card,
  ChakraText as Text,
  Flex,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { updateRaidInvoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { decodeAbiParameters, Hex } from 'viem';
import { useChainId, useWaitForTransactionReceipt } from 'wagmi';

import ChakraNextLink from '../ChakraNextLink';
import ZapAddresses from './ZapAddresses';

const EscrowSuccess = ({ raidId, txHash }: { raidId: string; txHash: Hex }) => {
  const [addresses, setAddresses] = useState<Hex[]>(); // [safe, projectTeamSplit, daoSplit, escrow]
  const chainId = useChainId();

  const { data: txData } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (!txData) return;
    // TODO handle `canRegisterDirectly` & raidId
    const localAddresses: Hex = _.get(
      _.last(_.get(txData, 'logs')),
      'data'
    ) as Hex;
    if (!localAddresses) return;
    const decodedAddresses = decodeAbiParameters(
      [
        { name: 'safe', type: 'address' },
        { name: 'projectTeamSplit', type: 'address' },
        { name: 'daoSplit', type: 'address' },
        { name: 'escrow', type: 'address' },
      ] as { name: string; type: string }[],
      localAddresses
    ) as unknown as Hex[];
    setAddresses(decodedAddresses as Hex[]);
    // update raid record with new invoice address
    if (!raidId) return;
    updateRaidInvoice(chainId, raidId, _.nth(decodedAddresses, 3));
  }, [chainId, txData, raidId]);

  // const { onCopy } = useClipboard(
  //   `https://${window.location.hostname}/escrow/${raidId}`
  // );
  // TODO redirect to new invoice page?

  return (
    <Card variant='filled' p={6}>
      <Stack w='full' spacing={4}>
        <Heading fontFamily='texturina' textTransform='uppercase' size='md'>
          {addresses ? 'Escrow Registered!' : 'Escrow Registration Received'}
        </Heading>

        {!addresses ? (
          <>
            <Text
              color='white'
              textAlign='center'
              fontSize='sm'
              fontFamily='texturina'
              mb='1rem'
            >
              {addresses
                ? 'You can view your transaction '
                : 'You can check the progress of your transaction '}
              <Link
                href={getTxLink(chainId, txHash)}
                isExternal
                color='yellow.500'
                textDecoration='underline'
                target='_blank'
                rel='noopener noreferrer'
                fontFamily='texturina'
              >
                here
              </Link>
            </Text>
            <Flex direction='column' alignItems='center'>
              <Spinner size='xl' />
              <br />
              <Text fontFamily='texturina'>Waiting for transaction</Text>
            </Flex>
          </>
        ) : (
          <ZapAddresses addresses={addresses} raidId={raidId} />
        )}

        <HStack>
          <ChakraNextLink href='/'>
            <Button variant='outline'>Return Home</Button>
          </ChakraNextLink>
          <ChakraNextLink href={`/escrow/${raidId}`}>
            <Button>Go to Escrow</Button>
          </ChakraNextLink>
        </HStack>
      </Stack>
    </Card>
  );
};

export default EscrowSuccess;
