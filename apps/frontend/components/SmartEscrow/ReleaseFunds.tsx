import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { useToast } from '@raidguild/design-system';
import { BigNumber, utils } from 'ethers';
import React, { useContext, useState } from 'react';

import { Loader } from './Loader';

import { SmartEscrowContext } from '../../contexts/SmartEscrow';

import { getTxLink, parseTokenAddress } from '../../smartEscrow/utils/helpers';
import { release } from '../../smartEscrow/utils/invoice';
import { getInvoice } from '../../smartEscrow/graphql/getInvoice';

// todo: typescript types
type ReleaseFundsProp = {
  invoice: any;
  balance: any;
};

export const ReleaseFunds = ({ invoice, balance }: ReleaseFundsProp) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    appState: { chainId, invoice_id, provider },
  } = useContext(SmartEscrowContext);
  const { currentMilestone, amounts, address, token } = invoice;

  const pollSubgraph = async () => {
    let isSubscribed = true;

    const interval = setInterval(async () => {
      let inv = await getInvoice(parseInt(chainId), invoice_id);
      console.log(
        'polling subgraph:  invoice_id, chainId: ',
        invoice_id,
        chainId
      );
      if (isSubscribed && !!inv) {
        console.log(`Invoice data received, ${inv}`);

        if (
          utils.formatUnits(inv.released, 18) >
          utils.formatUnits(invoice.released, 18)
        ) {
          isSubscribed = false;
          clearInterval(interval);
          console.log(
            utils.formatUnits(inv.released, 18),
            utils.formatUnits(invoice.released, 18)
          );
          window.location.reload();
        }
      }
    }, 5000);
  };

  const getReleaseAmount = (currentMilestone, amounts, balance) => {
    if (
      currentMilestone >= amounts.length ||
      (currentMilestone === amounts.length - 1 &&
        balance.gte(amounts[currentMilestone]))
    ) {
      return balance;
    }
    return BigNumber.from(amounts[currentMilestone]);
  };

  const [transaction, setTransaction] = useState();

  const releaseFunds = async () => {
    if (
      !loading &&
      provider &&
      balance &&
      balance.gte(getReleaseAmount(currentMilestone, amounts, balance))
    ) {
      try {
        setLoading(true);
        const tx = await release(provider, address);
        setTransaction(tx);
        await tx.wait();
        await pollSubgraph();
      } catch (releaseError) {
        console.log(releaseError);
        setLoading(false);
        toast.error({
          title: 'Oops there was an error',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
      }
    }
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
        Release Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem'>
        Follow the instructions in your wallet to release funds from escrow to
        the raid party.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text color='primary.300' fontSize='0.875rem' textAlign='center'>
          Amount To Be Released
        </Text>
        <Text
          color='yellow'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
        >{`${utils.formatUnits(
          getReleaseAmount(currentMilestone, amounts, balance),
          18
        )} ${parseTokenAddress(chainId, token)}`}</Text>
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

      {!loading && (
        <Button
          onClick={releaseFunds}
          textTransform='uppercase'
          variant='solid'
          w='100%'
        >
          Release
        </Button>
      )}
    </VStack>
  );
};
