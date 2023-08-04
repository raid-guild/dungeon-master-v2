import {
  Button,
  Heading,
  Link,
  Text,
  VStack,
  useToast,
} from '@raidguild/design-system';
import { utils } from 'ethers';
import { useContext, useState } from 'react';

import { SmartEscrowContext } from '../../contexts/SmartEscrow';
import { getTxLink, parseTokenAddress } from '../../smartEscrow/utils/helpers';
import { withdraw } from '../../smartEscrow/utils/invoice';

import { Loader } from './Loader';

export const WithdrawFunds = ({ contractAddress, token, balance, invoice }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const {
    appState: { chainId, provider },
  } = useContext(SmartEscrowContext);

  const [transaction, setTransaction] = useState();

  const withdrawFunds = async () => {
    if (!loading && provider && balance.gte(0)) {
      try {
        setLoading(true);
        const tx = await withdraw(provider, contractAddress);
        setTransaction(tx);
        await tx.wait();
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      } catch (withdrawError) {
        console.log(withdrawError);
        toast.error({
          title: 'Oops there was an error',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    }
  };
  console.log('withdraw funds chainId ', chainId, token);

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
        >{`${utils.formatUnits(balance, 18)} ${parseTokenAddress(
          chainId,
          token
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
