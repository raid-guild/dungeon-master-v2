import {
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { useLock } from '@raidguild/escrow-hooks';
import {
  Invoice,
  NETWORK_CONFIG,
  // uploadDisputeDetails,
} from '@raidguild/escrow-utils';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

import LockImage from '../../assets/lock.svg';
import Loader from './Loader';
import AccountLink from './shared/AccountLink';
import { OrderedTextarea } from './shared/OrderedTextArea';

const parseTokenAddress = (chainId: number, address: any) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(NETWORK_CONFIG[chainId].TOKENS)) {
    if ((value as any).address === address.toLowerCase()) {
      return key;
    }
  }
  return address;
};

const resolverInfo = {
  100: NETWORK_CONFIG[100].RESOLVERS,
  1: NETWORK_CONFIG[1].RESOLVERS,
};

const getResolverInfo = (chainId, resolver) =>
  (resolverInfo[chainId] || resolverInfo[4])[resolver];

const resolvers = {
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

const LockFunds = ({
  invoice,
  balance,
}: {
  invoice: Invoice;
  balance: bigint;
}) => {
  const chainId = useChainId();
  const { address, resolver, token, resolutionRate } = invoice;

  const [disputeReason, setDisputeReason] = useState('');

  const fee = `${formatUnits(
    resolutionRate === 0 ? BigInt(0) : BigInt(balance) / BigInt(resolutionRate),
    18
  )} ${parseTokenAddress(chainId, token)}`;

  const [locking, setLocking] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<any>();

  const { writeAsync: lockFunds } = useLock({
    invoice,
  });

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
        <AccountLink address={resolver} chainId={chainId} />
        {
          ' will review your case, the project agreement and dispute reasoning before making a decision on how to fairly distribute remaining funds.'
        }
      </Text>

      <OrderedTextarea
        tooltip='Why do you want to lock these funds?'
        label='Dispute Reason'
        placeholder='Dispute Reason'
        value={disputeReason}
        setValue={setDisputeReason}
      />
      <Text color='white' textAlign='center' fontFamily='texturina'>
        {`Upon resolution, a fee of ${fee} will be deducted from the locked fund amount and sent to `}
        <AccountLink address={resolver} chainId={chainId} />
        {` for helping resolve this dispute.`}
      </Text>
      <Button
        onClick={lockFunds}
        isDisabled={!disputeReason}
        textTransform='uppercase'
        variant='solid'
      >
        {`Lock ${formatUnits(BigInt(balance), 18)} ${parseTokenAddress(
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

export default LockFunds;
