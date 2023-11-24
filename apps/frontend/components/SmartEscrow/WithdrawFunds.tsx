import {
  Button,
  Heading,
  Link,
  Text,
  useToast,
  VStack,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { Invoice, parseTokenAddress } from '@raidguild/escrow-utils';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

import Loader from './Loader';

const WithdrawFunds = ({
  invoice,
  balance,
}: {
  invoice: Invoice;
  balance: bigint;
}) => {
  const toast = useToast();
  const chainId = useChainId();

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>();

  const withdrawFunds = async () => {
    // if (!loading && provider && balance.gte(0)) {
    //   try {
    //     setLoading(true);
    //     const tx = await withdraw(provider, contractAddress);
    //     setTransaction(tx);
    //     await tx.wait();
    //     setLoading(false);
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 20000);
    //   } catch (withdrawError) {
    //     console.error(withdrawError);
    //     toast.error({
    //       title: 'Oops there was an error',
    //       iconName: 'alert',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     setLoading(false);
    //   }
    // }
  };

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
      <Text textAlign='center' fontSize='sm' mb='1rem'>
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
        >{`${formatUnits(balance, 18)} ${parseTokenAddress(
          chainId,
          invoice?.token
        )}`}</Text>
      </VStack>
      {transaction && (
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
      )}
      {loading && <Loader />}
      <Button onClick={withdrawFunds} variant='solid' textTransform='uppercase'>
        Withdraw
      </Button>
    </VStack>
  );
};

export default WithdrawFunds;
