/* eslint-disable react/no-array-index-key */
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  ChakraCheckbox as Checkbox,
  ControlledSelect,
  Flex,
  Heading,
  HStack,
  Link,
  NumberInput,
  Stack,
  Text,
  Tooltip,
  useToast,
  VStack,
} from '@raidguild/design-system';
import { commify, getTxLink } from '@raidguild/dm-utils';
import {
  checkedAtIndex,
  depositedMilestones,
  getNativeTokenSymbol,
  getWrappedNativeToken,
  Invoice,
  parseTokenAddress,
  PAYMENT_TYPES,
} from '@raidguild/escrow-utils';
import { useDeposit } from '@smartinvoicexyz/hooks';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatUnits, Hex, parseUnits } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';

import { QuestionIcon } from './icons/QuestionIcon';

const DepositFunds = ({
  invoice,
  deposited,
  due,
}: {
  invoice: Invoice;
  deposited: bigint;
  due: bigint;
}) => {
  const { token, amounts, currentMilestone } = invoice;
  const chainId = useChainId();
  const { address } = useAccount();
  const toast = useToast();

  const TOKEN_DATA = useMemo(
    () => ({
      nativeSymbol: getNativeTokenSymbol(chainId),
      wrappedToken: getWrappedNativeToken(chainId),
      isWrapped: _.eq(_.toLower(token), getWrappedNativeToken(chainId)),
    }),
    [chainId, token]
  );

  const [transaction, setTransaction] = useState<Hex | undefined>();

  const localForm = useForm();
  const { watch, setValue } = localForm;

  const paymentType = watch('paymentType');
  const amount = watch('amount', '0');
  const checked = watch('checked');

  const amountsSum = _.sumBy(amounts); // number, not parsed
  const paidMilestones = depositedMilestones(BigInt(deposited), amounts);

  const { data: nativeBalance } = useBalance({ address });
  const { data: tokenBalance } = useBalance({ address, token });
  const balance =
    paymentType?.value === PAYMENT_TYPES.NATIVE
      ? nativeBalance?.value
      : tokenBalance?.value;
  const displayBalance =
    paymentType?.value === PAYMENT_TYPES.NATIVE
      ? nativeBalance?.formatted
      : tokenBalance?.formatted;
  const decimals =
    paymentType?.value === PAYMENT_TYPES.NATIVE ? 18 : tokenBalance?.decimals;
  const hasAmount = balance >= parseUnits(amount, decimals);

  const { handleDeposit, isLoading } = useDeposit({
    invoice: {
      tokenMetadata: {
        address: invoice.token, // only address is needed
        name: '',
        symbol: '',
        decimals,
        totalSupply: BigInt(0),
      },
      address: invoice.address,
    },
    amount: amount && parseUnits(amount, decimals),
    hasAmount, // (+ gas)
    paymentType: paymentType?.value,
    toast,
  });

  const depositHandler = async () => {
    const result = await handleDeposit();
    if (!result) return;
    setTransaction(result);
  };
  const paymentTypeOptions = [
    { value: PAYMENT_TYPES.TOKEN, label: parseTokenAddress(chainId, token) },
    { value: PAYMENT_TYPES.NATIVE, label: TOKEN_DATA.nativeSymbol },
  ];

  useEffect(() => {
    setValue('paymentType', paymentTypeOptions[0]);
    setValue('amount', '0');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!amount) return;

    setValue(
      'checked',
      depositedMilestones(
        BigInt(deposited) + parseUnits(amount, decimals),
        amounts
      )
    );
  }, [amount, amounts, decimals, deposited, setValue]);

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        color='white'
        as='h3'
        fontSize='2xl'
        transition='all ease-in-out .25s'
        _hover={{ cursor: 'pointer', color: 'raid' }}
      >
        Pay Invoice
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' color='whiteAlpha.700'>
        At a minimum, you’ll need to deposit enough to cover the{' '}
        {currentMilestone === 0 ? 'first' : 'next'} project payment.
      </Text>
      <Text textAlign='center' color='purple.400'>
        How much will you be depositing today?
      </Text>
      <VStack spacing='0.5rem' align='center'>
        {_.map(amounts, (a: number, i: number) => (
          <HStack key={`milestone-${i}`}>
            <Checkbox
              mx='auto'
              key={i.toString()}
              isChecked={checked?.[i]}
              isDisabled={paidMilestones[i]}
              onChange={(e) => {
                const newChecked = e.target.checked
                  ? checkedAtIndex(i, checked)
                  : checkedAtIndex(i - 1, checked);
                const totAmount = amounts.reduce(
                  (tot, cur, ind) =>
                    newChecked[ind] ? tot + BigInt(cur) : tot,
                  BigInt(0)
                );
                const newAmount =
                  totAmount > BigInt(deposited)
                    ? totAmount - BigInt(deposited)
                    : BigInt(0);

                setValue('amount', formatUnits(newAmount, decimals));
              }}
              color='yellow.300'
              border='none'
              size='lg'
              fontSize='1rem'
              fontFamily='texturina'
            >
              <Text>
                Payment #{i + 1} -{'  '}
                {commify(formatUnits(BigInt(a), decimals))}{' '}
                {parseTokenAddress(chainId, token)}
              </Text>
            </Checkbox>
          </HStack>
        ))}
      </VStack>

      <Text variant='textOne'>OR</Text>

      <Stack spacing='0.5rem' align='center' fontFamily='texturina'>
        <Flex justify='space-between' w='100%'>
          <Text fontWeight='500' color='whiteAlpha.700'>
            Enter a Manual Deposit Amount
          </Text>
          {paymentType === PAYMENT_TYPES.NATIVE && (
            <Tooltip
              label={`Your ${
                TOKEN_DATA.nativeSymbol
              } will be automagically wrapped to ${parseTokenAddress(
                chainId,
                token
              )} tokens`}
              placement='auto-start'
            >
              <QuestionIcon ml='1rem' boxSize='0.75rem' />
            </Tooltip>
          )}
        </Flex>

        <Flex>
          <NumberInput
            localForm={localForm}
            name='amount'
            type='number'
            variant='outline'
            placeholder='0'
            color='yellow.500'
            defaultValue='0'
            min={0}
            max={amountsSum}
          />

          <Flex width={250}>
            {TOKEN_DATA.isWrapped ? (
              <ControlledSelect
                options={paymentTypeOptions}
                value={paymentType}
                onChange={(e) => {
                  setValue('paymentType', e);
                }}
                // width='100%'
              />
            ) : (
              parseTokenAddress(chainId, token)
            )}
          </Flex>
        </Flex>
        {parseUnits(amount, decimals) > due && (
          <Alert bg='purple.900' borderRadius='md' mt={4}>
            <AlertIcon color='primary.300' />
            <AlertTitle fontSize='sm'>
              Your deposit is greater than the total amount due!
            </AlertTitle>
          </Alert>
        )}
      </Stack>
      <Flex
        color='white'
        justify='space-between'
        w={due ? '70%' : '50%'}
        fontSize='sm'
        fontFamily='texturina'
      >
        {deposited && (
          <VStack align='flex-start'>
            <Text fontWeight='bold'>Total Deposited</Text>
            <Text>
              {`${commify(
                formatUnits(BigInt(deposited), decimals)
              )} ${parseTokenAddress(chainId, token)}`}
            </Text>
          </VStack>
        )}
        {due && (
          <VStack>
            <Text fontWeight='bold'>Total Due</Text>
            <Text>
              {`${formatUnits(BigInt(due), decimals)} ${parseTokenAddress(
                chainId,
                token
              )}`}
            </Text>
          </VStack>
        )}
        {displayBalance && (
          <VStack align='flex-end'>
            <Text fontWeight='bold'>Your Balance</Text>
            <Text>
              {`${_.toNumber(displayBalance).toFixed(2)} ${
                paymentType?.value === PAYMENT_TYPES.TOKEN
                  ? parseTokenAddress(chainId, token)
                  : TOKEN_DATA.nativeSymbol
              }`}
            </Text>
          </VStack>
        )}
      </Flex>

      <Button
        onClick={depositHandler}
        isDisabled={amount <= 0 || isLoading || !hasAmount}
        isLoading={isLoading}
        textTransform='uppercase'
        variant='solid'
      >
        Deposit
      </Button>
      {transaction && (
        <Text color='white' textAlign='center' fontSize='sm'>
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainId, transaction)}
            isExternal
            color='primary.300'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )}
    </VStack>
  );
};

export default DepositFunds;
