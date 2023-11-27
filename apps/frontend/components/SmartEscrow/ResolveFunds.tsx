import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  NumberInput,
  Text,
  Textarea,
  VStack,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { useResolve } from '@raidguild/escrow-hooks';
import { Invoice, parseTokenAddress } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatUnits, parseUnits } from 'viem';
import { useChainId } from 'wagmi';

import Loader from './Loader';

// TODO make work

const ResolveFunds = ({
  invoice,
  balance,
  close,
}: {
  invoice: Invoice;
  balance: bigint;
  close: () => void;
}) => {
  const { resolutionRate, token } = invoice;
  const chainId = useChainId();

  const isLocked = true;

  const localForm = useForm();
  const { watch, handleSubmit } = localForm;

  let resolverAward = BigInt(0);
  try {
    if (resolutionRate !== 0 && balance > BigInt(0)) {
      resolverAward = balance / BigInt(resolutionRate);
    }
  } catch (e) {
    console.error('error in ResolveFunds component ', e);
  }

  const availableFunds =
    _.toNumber(formatUnits(balance, 18)) -
    _.toNumber(formatUnits(resolverAward, 18));

  const clientAward = watch('clientAward');
  const providerAward = watch('providerAward');
  const comments = watch('comments');

  const { writeAsync: resolve, isLoading } = useResolve({
    invoice,
    clientAward,
    providerAward,
  });

  const onSubmit = async () => {
    await resolve();
  };

  if (!isLocked) {
    return (
      <VStack
        w='100%'
        spacing='1rem'
        as='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading
          mb='1rem'
          color='white'
          as='h3'
          fontSize='2xl'
          transition='all ease-in-out .25s'
          _hover={{ cursor: 'pointer', color: 'raid' }}
        >
          Resolve Dispute
        </Heading>
        <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='texturina'>
          {isLocked
            ? `You’ll need to distribute the total balance of ${formatUnits(
                balance,
                18
              )} ${parseTokenAddress(
                chainId,
                token
              )} between the client and provider, excluding the ${
                resolutionRate === 0 ? '0' : 100 / resolutionRate
              }% arbitration fee which you shall receive.`
            : `Invoice is not locked`}
        </Text>
        <Button
          onClick={close}
          variant='solid'
          textTransform='uppercase'
          w='100%'
        >
          Close
        </Button>
      </VStack>
    );
  }

  return (
    <VStack w='100%' spacing='1rem' as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading
        mb='1rem'
        color='white'
        as='h3'
        fontSize='2xl'
        transition='all ease-in-out .25s'
        _hover={{ cursor: 'pointer', color: 'raid' }}
      >
        Resolve Dispute
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='texturina'>
        {`You’ll need to distribute the total balance of ${formatUnits(
          balance,
          18
        )} ${parseTokenAddress(
          chainId,
          token
        )} between the client and provider, excluding the ${
          resolutionRate === 0 ? '0' : 100 / resolutionRate
        }% arbitration fee which you shall receive.`}
      </Text>

      <Textarea
        name='comments'
        tooltip='Here you may explain your reasoning behind the resolution'
        label='Resolution Comments'
        placeholder='Resolution Comments'
        localForm={localForm}
        maxLength={10000}
      />

      <InputGroup>
        <NumberInput
          name='clientAward'
          label='Client Award'
          defaultValue={availableFunds}
          localForm={localForm}
          // onChange={(e) => {
          //   setClientAwardInput(e.target.value);
          //   if (e.target.value) {
          //     let award = parseUnits(e.target.value, 18);
          //     if (award > availableFunds) {
          //       award = availableFunds;
          //       setClientAwardInput(formatUnits(award, 18));
          //     }
          //     setClientAward(award);
          //     award = availableFunds - BigInt(award);
          //     setProviderAward(award);
          //     setProviderAwardInput(formatUnits(award, 18));
          //   }
          // }}
          placeholder='Client Award'
        />
        <InputRightElement w='3.5rem' color='yellow'>
          {parseTokenAddress(chainId, token)}
        </InputRightElement>
      </InputGroup>
      <InputGroup>
        <NumberInput
          name='providerAward'
          label='Provider Award'
          localForm={localForm}
          // onChange={(e) => {
          //   setProviderAwardInput(e.target.value);
          //   if (e.target.value) {
          //     let award = parseUnits(e.target.value, 18);
          //     if (award > availableFunds) {
          //       award = availableFunds;
          //       setProviderAwardInput(formatUnits(award, 18));
          //     }
          //     setProviderAward(award);
          //     award = availableFunds - BigInt(award);
          //     setClientAward(award);
          //     setClientAwardInput(formatUnits(award, 18));
          //   }
          // }}
          placeholder='Provider Award'
        />
        <InputRightElement w='3.5rem' color='yellow'>
          {parseTokenAddress(chainId, token)}
        </InputRightElement>
      </InputGroup>
      <InputGroup>
        <NumberInput
          name='resolverAward'
          label='Arbitration Fee'
          localForm={localForm}
          isDisabled
        />
        <InputRightElement w='3.5rem' color='yellow'>
          {parseTokenAddress(chainId, token)}
        </InputRightElement>
      </InputGroup>

      {/* {loading && <Loader />} */}

      {true && (
        <Button
          // onClick={resolveFunds}
          isDisabled={resolverAward <= BigInt(0) || !comments}
          textTransform='uppercase'
          variant='solid'
        >
          Resolve
        </Button>
      )}

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
    </VStack>
  );
};

export default ResolveFunds;
