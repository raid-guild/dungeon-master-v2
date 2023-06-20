import { Button, Heading, Link, Text, VStack } from '@raidguild/design-system';
import { utils, Contract } from 'ethers';
import { useContext, useState } from 'react';

import { Loader } from './Loader';

import { SmartEscrowContext } from '../../contexts/SmartEscrow';

import { getTxLink, parseTokenAddress } from '../../smartEscrow/utils/helpers';
import { awaitSpoilsWithdrawn, getSmartInvoiceAddress } from '../../smartEscrow/utils/invoice';
import { getInvoice } from '../../smartEscrow/graphql/getInvoice';
import { balanceOf } from '../../smartEscrow/utils/erc20';
import { notifyRaidSpoils } from '../../smartEscrow/utils/requests';

export const WithdrawWrappedBalance = ({ contractAddress, token, balance }) => {
  const [loading, setLoading] = useState(false);
  const { chainId, invoice_id, provider } = useContext(SmartEscrowContext);

  const [transaction, setTransaction] = useState();

  const pollSubgraph = async () => {
    const smartInvoice = await getSmartInvoiceAddress(invoice_id, provider);

    let isSubscribed = true;

    const interval = setInterval(async () => {
      const inv = await getInvoice(parseInt(chainId), smartInvoice);
      if (isSubscribed && !!inv) {
        console.log(`Invoice data received, ${inv}`);

        const newBalance = await balanceOf(provider, token, contractAddress);

        if (!(utils.formatUnits(newBalance, 18) > 0)) {
          isSubscribed = false;
          clearInterval(interval);
          console.log(
            utils.formatUnits(newBalance, 18),
            utils.formatUnits(balance, 18)
          );
          window.location.reload();
        }
      }
    }, 5000);
  };

  const notifySpoilsSent = async (tx) => {
    let result = await awaitSpoilsWithdrawn(provider, tx);

    let status = await notifyRaidSpoils(
      parseTokenAddress(chainId, result.token),
      utils.formatUnits(result.childShare, 18),
      utils.formatUnits(result.parentShare, 18),
      getTxLink(chainId, tx.hash)
    );
    console.log(status);
  };

  const withdrawFunds = async () => {
    if (!loading && provider && balance.gte(0)) {
      try {
        setLoading(true);
        const abi = new utils.Interface(['function withdrawAll() external']);
        const contract = new Contract(
          contractAddress,
          abi,
          provider
        );
        const tx = await contract.withdrawAll();
        setTransaction(tx);
        await tx.wait();
        notifySpoilsSent(tx);
        await pollSubgraph();
      } catch (withdrawError) {
        setLoading(false);
        console.log(withdrawError);
      }
    }
  };

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        fontWeight='normal'
        mb='1rem'
        textTransform='uppercase'
        textAlign='center'
        fontFamily='rubik'
        color='red'
      >
        Withdraw Balance
      </Heading>

      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        Follow the instructions in your wallet to withdraw the balance from
        wrapped invoice.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text
          color='red.500'
          fontSize='0.875rem'
          textAlign='center'
          fontFamily='jetbrains'
        >
          Balance Available
        </Text>
        <Text
          color='yellow'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
          fontFamily='jetbrains'
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
            color='red.500'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )}
      {loading && <Loader />}
      {!loading && (
        <Button
          onClick={withdrawFunds}
          variant='primary'
          textTransform='uppercase'
          w='100%'
        >
          Withdraw
        </Button>
      )}
    </VStack>
  );
};
