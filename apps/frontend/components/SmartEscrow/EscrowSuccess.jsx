/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Link, Heading, VStack } from '@chakra-ui/react';
import { Button, Text } from '@raidguild/design-system';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { utils } from 'ethers';

import { CopyIcon } from '../../smartEscrow/icons/CopyIcon';
import { Loader } from './Loader';

import { awaitInvoiceAddress, getSmartInvoiceAddress } from '../../smartEscrow/utils/invoice';
import { getInvoice } from '../../smartEscrow/graphql/getInvoice';
import { getTxLink, copyToClipboard, apiRequest } from '../../smartEscrow/utils/helpers';
import { updateRaidInvoice } from '../../smartEscrow/utils/requests';

const POLL_INTERVAL = 5000;

export const EscrowSuccess = ({
  ethersProvider,
  tx,
  chainId,
  raidId,
}) => {
  const [wrappedInvoiceId, setWrappedInvoiceId] = useState('');
  const [smartInvoiceId, setSmartInvoiceId] = useState('');
  const [invoice, setInvoice] = useState();
  const router = useRouter();
  console.log('escrow success: ethersProvider: ', ethersProvider);

  const [progressText, updateProgressText] = useState('');

  const postInvoiceId = async () => {
    console.log('postInvoiceId: ', raidId, wrappedInvoiceId);
    await updateRaidInvoice(raidId, wrappedInvoiceId);
  };

  const fetchSmartInvoiceId = () => {
    updateProgressText('Fetching Smart Invoice ID from Wrapped Invoice..');
    console.log('Fetching Smart Invoice ID from Wrapped Invoice..');
    getSmartInvoiceAddress(wrappedInvoiceId, ethersProvider).then((id) => {
      setSmartInvoiceId(id.toLowerCase());
      updateProgressText(`Received Smart Invoice ID.`);
      console.log(`Received Smart Invoice ID, ${id.toLowerCase()}`);
    });
  };

  const pollSubgraph = () => {
    let isSubscribed = true;
    const interval = setInterval(() => {
      console.log(
        `Indexing subgraph with chain ID ${chainId} & Smart Invoice ID ${smartInvoiceId}`
      );
      getInvoice(chainId, smartInvoiceId).then((inv) => {
        console.log(`Data returned, ${inv}`);
        if (isSubscribed && !!inv) {
          setInvoice(inv);
          updateProgressText(`Invoice data received.`);
          console.log(`Invoice data received, ${inv}`);
        }
      });
    }, POLL_INTERVAL);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  };

  useEffect(() => {
    if (tx && ethersProvider) {
      updateProgressText('Fetching Wrapped Invoice ID...');
      console.log('Fetching Wrapped Invoice ID...');
      awaitInvoiceAddress(ethersProvider, tx).then((id) => {
        setWrappedInvoiceId(id.toLowerCase());
        updateProgressText(`Received Wrapped Invoice ID.`);
        console.log(`Received Wrapped Invoice ID, ${id.toLowerCase()}`);
      });
    }
  }, [tx, ethersProvider]);

  useEffect(() => {
    if (!utils.isAddress(smartInvoiceId) || !!invoice) return () => undefined;

    updateProgressText('Indexing subgraph for invoice data..');

    setTimeout(() => {
      pollSubgraph();
    }, 10000);
  }, [chainId, smartInvoiceId, invoice]);

  useEffect(() => {
    if (utils.isAddress(wrappedInvoiceId)) {
      postInvoiceId();
      fetchSmartInvoiceId();
    }
  }, [wrappedInvoiceId]);

  return (
    <Flex
      direction='column'
      alignItems='center'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <Heading
        fontFamily='texturina'
        textTransform='uppercase'
        size='md'
        mb='2rem'
      >
        {invoice ? 'Escrow Registered!' : 'Escrow Registration Received'}
      </Heading>

      <Text
        color='white'
        textAlign='center'
        fontSize='sm'
        fontFamily='texturina'
        mb='1rem'
      >
        {wrappedInvoiceId
          ? 'You can view your transaction '
          : 'You can check the progress of your transaction '}
        <Link
          href={getTxLink(chainId, tx.hash)}
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

      {invoice ? (
        <VStack w='100%' align='stretch' mb='1rem'>
          <Text fontWeight='bold' variant='mono' color='red.500'>
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
            {document.queryCommandSupported('copy') && (
              <Button
                ml={4}
                onClick={() =>
                  copyToClipboard(
                    `https://${window.location.hostname}/escrow/${raidId}`
                  )
                }
                bgColor='black'
                h='auto'
                w='auto'
                minW='2'
                p={2}
              >
                <CopyIcon boxSize={4} />
              </Button>
            )}{' '}
          </Flex>
        </VStack>
      ) : (
        <Flex direction='column' alignItems='center'>
          <Loader />
          <br />
          <Text fontFamily='texturina'>{progressText}</Text>
        </Flex>
      )}

      <Button
        variant='outline'
        onClick={() => {
          router.push(`/`);
        }}
        mt='1rem'
      >
        return home
      </Button>
    </Flex>
  );
};
