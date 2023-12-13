import {
  Button,
  Card,
  ChakraText as Text,
  Flex,
  Heading,
  Link,
  Spinner,
  useClipboard,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { updateRaidInvoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { decodeAbiParameters, Hex } from 'viem';
import { useChainId, useWaitForTransaction } from 'wagmi';

import ZapAddresses from './ZapAddresses';

const POLL_INTERVAL = 5000;

const EscrowSuccess = ({
  raidId,
  txHash,
  escrowForm,
}: {
  raidId: string;
  txHash: Hex;
  escrowForm: UseFormReturn<any>;
}) => {
  // const [invoice, setInvoice] = useState();
  const [addresses, setAddresses] = useState<Hex[]>(); // [safe, projectTeamSplit, daoSplit, escrow]
  const router = useRouter();
  const chainId = useChainId();
  const { watch } = escrowForm;
  const { daoSplit, raidPartySplit } = watch();
  const canRegisterDirectly = !raidPartySplit && !daoSplit;

  const { data: txData } = useWaitForTransaction({
    hash: txHash,
  });

  useEffect(() => {
    if (!txData) return;
    // TODO handle `canRegisterDirectly` & raidId
    const localAddresses: any = _.get(_.last(_.get(txData, 'logs')), 'data');
    if (!localAddresses) return;
    console.log(localAddresses);
    setAddresses(
      decodeAbiParameters(
        [
          { name: 'safe', type: 'address' },
          { name: 'projectTeamSplit', type: 'address' },
          { name: 'daoSplit', type: 'address' },
          { name: 'escrow', type: 'address' },
        ] as { name: string; type: string }[],
        localAddresses
      ) as Hex[]
    );
    // update raid record with new invoice address
    if (!raidId) return;
    updateRaidInvoice(raidId, _.nth(localAddresses, 3));
  }, [txData, raidId]);
  console.log(txData, addresses);

  // const pollSubgraph = () => {
  //   let isSubscribed = true;
  //   const interval = setInterval(() => {
  //     getInvoice(chainId, smartInvoiceId).then((inv) => {
  //       if (isSubscribed && !!inv) {
  //         setInvoice(inv);
  //         updateProgressText(`Invoice data received.`);
  //         clearInterval(interval);
  //       }
  //     });
  //   }, POLL_INTERVAL);
  //   return () => {
  //     alert('clear interval is called');
  //     isSubscribed = false;
  //     clearInterval(interval);
  //   };
  // };

  const { onCopy } = useClipboard(
    `https://${window.location.hostname}/escrow/${raidId}`
  );

  // useEffect(() => {
  //   if (!isAddress(smartInvoiceId) || !!invoice) return () => undefined;

  //   updateProgressText('Indexing subgraph for invoice data..');

  //   setTimeout(() => {
  //     pollSubgraph();
  //   }, 10000);
  // }, [chainId, smartInvoiceId, invoice]);

  // useEffect(() => {
  //   if (isAddress(smartInvoiceId)) {
  //     postInvoiceId();
  //   }
  // }, [smartInvoiceId]);

  // TODO redirect to new invoice page

  return (
    <Card variant='filled' p={6}>
      <Heading
        fontFamily='texturina'
        textTransform='uppercase'
        size='md'
        mb='2rem'
      >
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

      {/* {addresses ? (
        <VStack w='100%' align='stretch' mb='1rem'>
          <Text fontWeight='bold' variant='mono' color='primary.300'>
            Invoice URL
          </Text>
          <Flex
            p='0.3rem'
            justify='space-between'
            align='center'
            bg='black'
            borderRadius='0.25rem'
            w='100%'
            fontFamily='texturina'
          >
            <Link
              ml='0.5rem'
              href={`/escrow/${raidId}`}
              color='yellow.500'
              overflow='hidden'
            >
              {`https://${window.location.hostname}/escrow/${raidId}`}
            </Link>

            <Button
              ml={4}
              onClick={onCopy}
              bgColor='black'
              h='auto'
              w='auto'
              minW='2'
              p={2}
            >
              <CopyIcon boxSize={4} />
            </Button>
          </Flex>
        </VStack>
      ) : ( */}

      {/* )} */}

      <Button
        variant='outline'
        onClick={() => {
          router.push(`/`);
        }}
        mt='1rem'
      >
        return home
      </Button>
    </Card>
  );
};

export default EscrowSuccess;
