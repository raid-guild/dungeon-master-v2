/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Text, Link, Button, Heading, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { utils } from 'ethers';

import { CopyIcon } from '../icons/CopyIcon';
import { Loader } from '../components/Loader';

import { awaitInvoiceAddress, getSmartInvoiceAddress } from '../utils/invoice';
import { getInvoice } from '../graphql/getInvoice';
import { getTxLink, copyToClipboard, apiRequest } from '../utils/helpers';
import { updateRaidInvoice } from '../utils/requests';

const POLL_INTERVAL = 5000;

export const EscrowSuccess = ({
  ethersProvider,
  tx,
  chainID,
  raidID,  
}) => {
  const [wrappedInvoiceId, setWrappedInvoiceId] = useState('');
  const [smartInvoiceId, setSmartInvoiceId] = useState('');
  const [invoice, setInvoice] = useState();
  const router = useRouter();

  const [progressText, updateProgressText] = useState('');

  const postInvoiceId = async () => {
    await updateRaidInvoice(raidID, wrappedInvoiceId);
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
        `Indexing subgraph with chain ID ${chainID} & Smart Invoice ID ${smartInvoiceId}`
      );
      getInvoice(chainID, smartInvoiceId).then((inv) => {
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
  }, [chainID, smartInvoiceId, invoice]);

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
        fontFamily='spaceMono'
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
        fontFamily='jetbrains'
        mb='1rem'
      >
        {wrappedInvoiceId
          ? 'You can view your transaction '
          : 'You can check the progress of your transaction '}
        <Link
          href={getTxLink(chainID, tx.hash)}
          isExternal
          color='yellow'
          textDecoration='underline'
          target='_blank'
          rel='noopener noreferrer'
        >
          here
        </Link>
      </Text>

      {invoice ? (
        <VStack w='100%' align='stretch' mb='1rem'>
          <Text fontWeight='bold' variant='textOne' color='red'>
            Invoice URL
          </Text>
          <Flex
            p='0.3rem'
            justify='space-between'
            align='center'
            bg='black'
            borderRadius='0.25rem'
            w='100%'
            fontFamily='spaceMono'
          >
            <Link
              ml='0.5rem'
              href={`/escrow/${raidID}`}
              color='yellow'
              overflow='hidden'
            >
              {`https://${window.location.hostname}/escrow/${raidID}`}
            </Link>
            {document.queryCommandSupported('copy') && (
              <Button
                ml={4}
                onClick={() =>
                  copyToClipboard(
                    `https://${window.location.hostname}/escrow/${raidID}`
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
          <Text fontFamily='jetbrains'>{progressText}</Text>
        </Flex>
      )}

      <Button
        variant='primary'
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
