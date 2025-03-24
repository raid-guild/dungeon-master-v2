import {
  Button,
  Heading,
  InputGroup,
  InputRightElement,
  NumberInput,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@raidguild/design-system';
// import { getTxLink } from '@raidguild/dm-utils';
import { Invoice, parseTokenAddress } from '@raidguild/escrow-utils';
import { FormResolve, useDebounce, useResolve } from '@smartinvoicexyz/hooks';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

// TODO handle onChange for award amounts

const ResolveFunds = ({
  invoice,
  balance,
  close,
}: {
  invoice: Invoice;
  balance: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };
  close: () => void;
}) => {
  const { resolutionRate, token } = invoice;
  const chainId = useChainId();

  const isLocked = true;
  const localForm = useForm({});
  const { watch, handleSubmit, setValue } = localForm;

  const resolverAward = useMemo(() => {
    if (resolutionRate === 0 || balance.value === BigInt(0)) {
      return 0;
    }
    return _.toNumber(
      formatUnits(
        balance.value / BigInt(resolutionRate),
        invoice.tokenMetadata.decimals
      )
    );
  }, [balance, invoice, resolutionRate]);

  const availableFunds =
    _.toNumber(formatUnits(balance.value, invoice.tokenMetadata.decimals)) -
    resolverAward;

  const description = useDebounce(watch('description'), 250);

  const queryClient = useQueryClient();

  const onTxSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ['invoiceDetails'],
    });
  };

  const { writeAsync: resolve, isLoading } = useResolve({
    invoice: {
      tokenBalance: balance,
      tokenMetadata: {
        decimals: invoice.tokenMetadata.decimals,
        address: invoice.token,
        name: '',
        symbol: '',
        totalSupply: BigInt(0),
      },
      isLocked: invoice.isLocked,
      address: invoice.address,
      metadata: { title: '' },
    },
    details:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    localForm: localForm as unknown as UseFormReturn<FormResolve>,
    onTxSuccess,
  });

  const onSubmit = async () => {
    await resolve();
  };

  useEffect(() => {
    if (availableFunds > 0) {
      setValue('clientAward', availableFunds);
      setValue('providerAward', 0);
      setValue('resolverAward', resolverAward);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                balance.value,
                invoice.tokenMetadata.decimals
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
    <VStack as='form' w='100%' spacing='1rem' onSubmit={handleSubmit(onSubmit)}>
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
          balance.value,
          invoice.tokenMetadata.decimals
        )} ${parseTokenAddress(
          chainId,
          token
        )} between the client and provider, excluding the ${
          resolutionRate === 0 ? '0' : 100 / resolutionRate
        }% arbitration fee which you shall receive.`}
      </Text>

      <Textarea
        name='description'
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
          localForm={localForm}
          placeholder='Client Award'
          registerOptions={{
            onChange: (value) => {
              if (value > availableFunds) {
                setValue('clientAward', availableFunds);
                setValue('providerAward', 0);
              }
              setValue('providerAward', availableFunds - value);
            },
          }}
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
          placeholder='Provider Award'
          registerOptions={{
            onChange: (value) => {
              if (value > availableFunds) {
                setValue('providerAward', availableFunds);
                setValue('clientAward', 0);
              }
              setValue('clientAward', availableFunds - value);
            },
          }}
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

      {isLoading && <Spinner size='xl' />}

      {true && (
        <Button
          type='submit'
          isDisabled={resolverAward <= 0 || !description || !resolve}
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
