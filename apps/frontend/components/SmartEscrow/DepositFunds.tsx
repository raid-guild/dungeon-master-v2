/* eslint-disable react/no-array-index-key */
import {
  // Alert,
  // AlertIcon,
  // AlertTitle,
  Button,
  ChakraCheckbox as Checkbox,
  ControlledSelect,
  Flex,
  Heading,
  HStack,
  InputGroup,
  InputRightElement,
  Link,
  NumberInput,
  Text,
  Tooltip,
  VStack,
} from '@raidguild/design-system';
import { commify, getTxLink } from '@raidguild/dm-utils';
import { useDeposit } from '@raidguild/escrow-hooks';
import {
  checkedAtIndex,
  depositedMilestones,
  getNativeTokenSymbol,
  getWrappedNativeToken,
  Invoice,
  parseTokenAddress,
  PAYMENT_TYPES,
} from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatUnits, Hex, parseEther, parseUnits } from 'viem';
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

  const TOKEN_DATA = useMemo(
    () => ({
      nativeSymbol: getNativeTokenSymbol(chainId),
      wrappedToken: getWrappedNativeToken(chainId),
      isWrapped: _.eq(_.toLower(token), getWrappedNativeToken(chainId)),
    }),
    [chainId, token]
  );

  console.log(invoice);

  const [transaction, setTransaction] = useState<Hex | undefined>();

  const localForm = useForm();
  const { watch, setValue } = localForm;

  const paymentType = watch('paymentType');
  const amount = watch('amount', '0');
  const checked = watch('checked');

  const amountsSum = _.sumBy(amounts); // bigint, not parsed
  const paidMilestones = depositedMilestones(BigInt(deposited), amounts);

  const { data: nativeBalance } = useBalance({ address });
  const { data: tokenBalance } = useBalance({ address, token });
  const balance =
    paymentType?.value === PAYMENT_TYPES.NATIVE
      ? nativeBalance.value
      : tokenBalance.value;
  const displayBalance =
    paymentType?.value === PAYMENT_TYPES.NATIVE
      ? nativeBalance.formatted
      : tokenBalance.formatted;

  const { writeAsync, isLoading } = useDeposit({
    invoice,
    amount,
    hasAmount: balance > amount, // (+ gas)
    paymentType: paymentType?.value,
  });

  const handleDeposit = async () => {
    const result = await writeAsync();
    setTransaction(result.hash);
  };

  const paymentTypeOptions = [
    { value: PAYMENT_TYPES.TOKEN, label: parseTokenAddress(chainId, token) },
    { value: PAYMENT_TYPES.NATIVE, label: TOKEN_DATA.nativeSymbol },
  ];

  useEffect(() => {
    setValue('paymentType', paymentTypeOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!amount) return;

    setValue(
      'checked',
      depositedMilestones(BigInt(deposited) + parseUnits(amount, 18), amounts)
    );
  }, [amount, deposited, amounts, setValue]);

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
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='texturina'>
        At a minimum, you’ll need to deposit enough to cover the{' '}
        {currentMilestone === 0 ? 'first' : 'next'} project payment.
      </Text>
      <Text textAlign='center' color='primary.500' fontFamily='texturina'>
        How much will you be depositing today?
      </Text>
      <VStack spacing='0.5rem' align='center'>
        {amounts.map((a: number, i: number) => (
          <HStack>
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

                setValue('amount', formatUnits(newAmount, 18));
              }}
              color='yellow.500'
              border='none'
              size='lg'
              fontSize='1rem'
              fontFamily='texturina'
            >
              <Text>
                Payment #{i + 1} -{'  '}
                {commify(formatUnits(BigInt(a), 18))}{' '}
                {parseTokenAddress(chainId, token)}
              </Text>
            </Checkbox>
          </HStack>
        ))}
      </VStack>

      <Text variant='textOne'>OR</Text>

      <VStack spacing='0.5rem' align='stretch' fontFamily='texturina'>
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
        <InputGroup w='400px'>
          <NumberInput
            localForm={localForm}
            name='amount'
            type='number'
            variant='outline'
            color='yellow.500'
            defaultValue='0'
            min={0}
            max={amountsSum}
            mr={TOKEN_DATA.isWrapped ? '8.5rem' : '3.5rem'}
          />
          <InputRightElement w={TOKEN_DATA.isWrapped ? '8.5rem' : '3.5rem'}>
            {TOKEN_DATA.isWrapped ? (
              <ControlledSelect
                options={paymentTypeOptions}
                value={paymentType}
                onChange={(e) => {
                  setValue('paymentType', e);
                }}
              />
            ) : (
              parseTokenAddress(chainId, token)
            )}
          </InputRightElement>
        </InputGroup>
        {/* {amount.gt(due) && (
          <Alert bg='none'>
            <AlertIcon color='primary.300' />
            <AlertTitle fontSize='sm'>
              Your deposit is greater than the due amount!
            </AlertTitle>
          </Alert>
        )} */}
      </VStack>
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
                formatUnits(BigInt(deposited), 18)
              )} ${parseTokenAddress(chainId, token)}`}
            </Text>
          </VStack>
        )}
        {due && (
          <VStack>
            <Text fontWeight='bold'>Total Due</Text>
            <Text>
              {`${formatUnits(BigInt(due), 18)} ${parseTokenAddress(
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
                paymentType === 0
                  ? parseTokenAddress(chainId, token)
                  : TOKEN_DATA.nativeSymbol
              }`}
            </Text>
          </VStack>
        )}
      </Flex>

      <Button
        onClick={handleDeposit}
        isDisabled={amount <= 0 || !writeAsync}
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
