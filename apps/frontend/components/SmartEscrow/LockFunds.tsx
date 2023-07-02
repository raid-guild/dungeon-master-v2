import {
  Button,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import { useCallback, useContext, useState } from 'react';

import LockImage from '../../smartEscrow/assets/lock.svg';
import { SmartEscrowContext } from '../../contexts/SmartEscrow';

import { AccountLink } from './shared/AccountLink';
import { OrderedTextarea } from './shared/OrderedTextArea';
import { getTxLink } from '../../smartEscrow/utils/helpers';
import { lock } from '../../smartEscrow/utils/invoice';
import { uploadDisputeDetails } from '../../smartEscrow/utils/ipfs';
import { Loader } from './Loader';

import { NETWORK_CONFIG } from '../../smartEscrow/utils/constants';

const parseTokenAddress = (chainId, address) => {
  for (const [key, value] of Object.entries(
    NETWORK_CONFIG[parseInt(chainId)]['TOKENS']
  )) {
    if (value['address'] === address.toLowerCase()) {
      return key;
    }
  }
};

const resolverInfo = {
  4: NETWORK_CONFIG[4].RESOLVERS,
  100: NETWORK_CONFIG[100].RESOLVERS,
  1: NETWORK_CONFIG[1].RESOLVERS,
};

const getResolverInfo = (chainId, resolver) =>
  (resolverInfo[chainId] || resolverInfo[4])[resolver];

const resolvers = {
  4: Object.keys(NETWORK_CONFIG[4].RESOLVERS),
  100: Object.keys(NETWORK_CONFIG[100].RESOLVERS),
  1: Object.keys(NETWORK_CONFIG[1].RESOLVERS),
};

const getResolvers = (chainId) => resolvers[chainId] || resolvers[4];
const isKnownResolver = (chainId, resolver) =>
  getResolvers(chainId).indexOf(resolver.toLowerCase()) !== -1;

const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};
const getResolverString = (chainId, resolver) => {
  const info = getResolverInfo(chainId, resolver);
  return info ? info.name : getAccountString(resolver);
};

export const LockFunds = ({
  invoice,
  balance,
  wrappedAddress,
  isRaidParty,
}) => {
  const {
    appState: { chainId, provider },
  } = useContext(SmartEscrowContext);
  const { address, resolver, token, resolutionRate } = invoice;

  const [disputeReason, setDisputeReason] = useState('');

  const fee = `${utils.formatUnits(
    resolutionRate === '0'
      ? BigNumber.from('0')
      : BigNumber.from(balance).div(resolutionRate),
    18
  )} ${parseTokenAddress(chainId, token)}`;

  const [locking, setLocking] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<any>();

  const lockFunds = useCallback(async () => {
    if (provider && !locking && balance.gt(0) && disputeReason) {
      try {
        setLocking(true);
        const detailsHash = await uploadDisputeDetails({
          reason: disputeReason,
          invoice: address,
          amount: balance.toString(),
        });
        const tx = await lock(
          provider,
          isRaidParty ? wrappedAddress : address,
          detailsHash
        );
        setTransaction(tx);
        await tx.wait();
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      } catch (lockError) {
        setLocking(false);
        console.log(lockError);
      }
    }
  }, [
    provider,
    locking,
    balance,
    disputeReason,
    address,
    isRaidParty,
    wrappedAddress,
  ]);

  if (locking) {
    return (
      <VStack w='100%' spacing='1rem'>
        <Heading
          color='white'
          as='h3'
          fontSize='2xl'
          transition='all ease-in-out .25s'
          _hover={{ cursor: 'pointer', color: 'raid' }}
        >
          Locking Funds
        </Heading>
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
        <Flex
          w='100%'
          justify='center'
          align='center'
          minH='7rem'
          my='3rem'
          position='relative'
          color='primary.300'
        >
          <Loader size='6rem' />
          <Flex
            position='absolute'
            left='50%'
            top='50%'
            transform='translate(-50%,-50%)'
          >
            <Image src={LockImage.src} width='2rem' alt='lock image' />
          </Flex>
        </Flex>
      </VStack>
    );
  }

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        color='white'
        as='h3'
        fontSize='2xl'
        transition='all ease-in-out .25s'
        _hover={{ cursor: 'pointer', color: 'raid' }}
      >
        Lock Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='texturina'>
        Locking freezes all remaining funds in the contract and initiates a
        dispute.
      </Text>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='texturina'>
        {'Once a dispute has been initiated, '}
        <AccountLink address={resolver} />
        {
          ' will review your case, the project agreement and dispute reasoning before making a decision on how to fairly distribute remaining funds.'
        }
      </Text>

      <OrderedTextarea
        tooltip='Why do you want to lock these funds?'
        label='Dispute Reason'
        value={disputeReason}
        setValue={setDisputeReason}
      />
      <Text color='white' textAlign='center' fontFamily='texturina'>
        {`Upon resolution, a fee of ${fee} will be deducted from the locked fund amount and sent to `}
        <AccountLink address={resolver} />
        {` for helping resolve this dispute.`}
      </Text>
      <Button
        onClick={lockFunds}
        isDisabled={!disputeReason}
        textTransform='uppercase'
        variant='solid'
        w='100%'
      >
        {`Lock ${utils.formatUnits(balance, 18)} ${parseTokenAddress(
          chainId,
          token
        )}`}
      </Button>
      {isKnownResolver(chainId, resolver) && (
        <Link
          href={getResolverInfo(chainId, resolver).termsUrl}
          isExternal
          color='primary.300'
          textDecor='underline'
        >
          Learn about {getResolverString(chainId, resolver)} dispute process &
          terms
        </Link>
      )}
    </VStack>
  );
};