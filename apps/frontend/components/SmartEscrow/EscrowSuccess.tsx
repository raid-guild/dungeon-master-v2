import {
  Button,
  ChakraText as Text,
  Flex,
  Heading,
  Link,
  Spinner,
  useClipboard,
  VStack,
} from '@raidguild/design-system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useChainId } from 'wagmi';

// import { getTxLink } from '@raidguild/dm-utils';
import { CopyIcon } from './icons/CopyIcon';

// import { getInvoice } from '@raidguild/escrow-gql';

const POLL_INTERVAL = 5000;

const EscrowSuccess = ({ raidId }: { raidId: string }) => {
  const [invoice, setInvoice] = useState();
  const router = useRouter();
  const chainId = useChainId();

  const [progressText, updateProgressText] = useState('');

  // const postInvoiceId = async () => {
  //   await updateRaidInvoice(raidId, smartInvoiceId);
  // };

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
        {/* {smartInvoiceId
          ? 'You can view your transaction '
          : 'You can check the progress of your transaction '} */}
        Test
        <Link
          href='https://raidguild.org' // {getTxLink(chainId, tx.hash)}
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
      ) : (
        <Flex direction='column' alignItems='center'>
          <Spinner size='xl' />
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

export default EscrowSuccess;
