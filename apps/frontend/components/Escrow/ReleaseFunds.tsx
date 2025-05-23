import {
  Button,
  ChakraText as Text,
  Heading,
  Spinner,
  // Link,
  useToast,
  VStack,
} from '@raidguild/design-system';
import { Invoice, parseTokenAddress } from '@raidguild/escrow-utils';
import { useRelease } from '@smartinvoicexyz/hooks';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

type ReleaseFundsProp = {
  invoice: Invoice;
  balance: bigint;
};

const getReleaseAmount = (currentMilestone, amounts, balance) => {
  if (
    currentMilestone >= amounts.length ||
    (currentMilestone === amounts.length - 1 &&
      balance.gte(amounts[currentMilestone]))
  ) {
    return balance;
  }
  return BigInt(amounts[currentMilestone]);
};

const ReleaseFunds = ({ invoice, balance }: ReleaseFundsProp) => {
  const toast = useToast();
  const chainId = useChainId();

  const { address, currentMilestone, amounts, token } = invoice;

  const onSuccess = async () => {
    toast.success({ title: 'Funds released successfully' });
  };

  const { writeAsync: releaseFunds, isLoading } = useRelease({
    invoice: { address },
    onTxSuccess: onSuccess,
    toast,
  });

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        mb='1rem'
        color='white'
        as='h3'
        fontSize='2xl'
        transition='all ease-in-out .25s'
        _hover={{ cursor: 'pointer', color: 'raid' }}
      >
        Release Funds
      </Heading>
      <Text
        textAlign='center'
        fontSize='sm'
        mb='1rem'
        w='60%'
        color='whiteAlpha.800'
      >
        Follow the instructions in your wallet to release funds from escrow to
        the raid party.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text color='primary.200' fontSize='0.875rem' textAlign='center'>
          Amount To Be Released
        </Text>
        <Text
          color='yellow.500'
          fontSize='xl'
          fontWeight='bold'
          fontFamily='texturina'
          textAlign='center'
        >{`${formatUnits(
          getReleaseAmount(currentMilestone, amounts, balance),
          invoice.tokenMetadata.decimals
        )} ${parseTokenAddress(chainId, token)}`}</Text>
      </VStack>
      {/* {transaction && (
        <Text color='white' textAlign='center' fontSize='sm'>
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainId, transaction.hash)}
            isExternal
            color='primary.300'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )} */}
      {isLoading ? (
        <Spinner size='xl' />
      ) : (
        <Button
          onClick={releaseFunds}
          isDisabled={!releaseFunds || isLoading}
          isLoading={isLoading}
          textTransform='uppercase'
          variant='solid'
        >
          Release
        </Button>
      )}
    </VStack>
  );
};

export default ReleaseFunds;
