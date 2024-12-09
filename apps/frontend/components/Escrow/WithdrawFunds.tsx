import {
  Button,
  Heading,
  // Link,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@raidguild/design-system';
// import { getTxLink } from '@raidguild/dm-utils';
import { Invoice, parseTokenAddress } from '@raidguild/escrow-utils';
import { useWithdraw } from '@smartinvoicexyz/hooks';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

const WithdrawFunds = ({
  invoice,
  balance,
}: {
  invoice: Invoice;
  balance: bigint;
}) => {
  const chainId = useChainId();
  const toast = useToast();

  const { writeAsync: withdrawFunds, isLoading } = useWithdraw({
    invoice: { address: invoice.address },
    onTxSuccess: () => {},
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
        Withdraw Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' w='70%'>
        Follow the instructions in your wallet to withdraw remaining funds from
        the escrow.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text color='primary.300' fontSize='0.875rem' textAlign='center'>
          Amount To Be Withdrawn
        </Text>
        <Text
          color='yellow'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
        >{`${formatUnits(
          balance,
          invoice?.tokenMetadata.decimals
        )} ${parseTokenAddress(chainId, invoice?.token)}`}</Text>
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
      {isLoading && <Spinner size='xl' />}
      <Button
        onClick={withdrawFunds}
        isDisabled={!withdrawFunds}
        variant='solid'
        textTransform='uppercase'
      >
        Withdraw
      </Button>
    </VStack>
  );
};

export default WithdrawFunds;
