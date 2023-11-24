/* eslint-disable react/no-array-index-key */
import {
  // Alert,
  // AlertIcon,
  // AlertTitle,
  Button,
  ChakraCheckbox as Checkbox,
  ChakraInput as Input,
  ChakraSelect as Select,
  Flex,
  Heading,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  Tooltip,
  useToast,
  VStack,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { useDeposit } from '@raidguild/escrow-hooks';
import {
  checkedAtIndex,
  getCheckedStatus,
  getNativeTokenSymbol,
  getWrappedNativeToken,
  Invoice,
  parseTokenAddress,
} from '@raidguild/escrow-utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatUnits, isAddress, parseUnits } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';

import { QuestionIcon } from './icons/QuestionIcon';
import Loader from './Loader';

const DepositFunds = ({
  invoice,
  deposited,
  due,
}: {
  invoice: Invoice;
  deposited: bigint;
  due: bigint;
}) => {
  const { address: invoiceAddress, token, amounts, currentMilestone } = invoice;
  const toast = useToast();
  const chainId = useChainId();
  const { address } = useAccount();

  const NATIVE_TOKEN_SYMBOL = getNativeTokenSymbol(chainId);
  const WRAPPED_NATIVE_TOKEN = getWrappedNativeToken(chainId);
  const isWRAPPED = token.toLowerCase() === WRAPPED_NATIVE_TOKEN;

  const [paymentType, setPaymentType] = useState(0); // 0 = Wrapped 1 = native token
  const [amount, setAmount] = useState(BigInt(0));
  const [amountInput, setAmountInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>();

  const initialStatus: boolean[] = getCheckedStatus(BigInt(deposited), amounts);
  const [checked, setChecked] = useState(initialStatus);

  const localForm = useForm();

  const { data: nativeBalance } = useBalance({ address });
  const { data: tokenBalance } = useBalance({ address, token });
  const balance = paymentType === 0 ? nativeBalance : tokenBalance;

  const { data: invoiceNativeBalance } = useBalance({
    address: invoiceAddress,
  });
  const { data: invoiceTokenBalance } = useBalance({
    address: invoiceAddress,
    token,
  });

  const { writeAsync } = useDeposit({
    invoice,
    amount,
  });

  console.log(balance);

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
      <VStack spacing='0.5rem'>
        {amounts.map((a: number, i: number) => (
          <Checkbox
            minW='300px'
            key={i.toString()}
            isChecked={checked[i]}
            isDisabled={initialStatus[i]}
            onChange={(e) => {
              const newChecked = e.target.checked
                ? checkedAtIndex(i, checked)
                : checkedAtIndex(i - 1, checked);
              const totAmount = amounts.reduce(
                (tot, cur, ind) => (newChecked[ind] ? tot + BigInt(cur) : tot),
                BigInt(0)
              );
              const newAmount =
                totAmount > BigInt(deposited)
                  ? totAmount - BigInt(deposited)
                  : BigInt(0);

              setChecked(newChecked);
              setAmount(newAmount);
              setAmountInput(formatUnits(newAmount, 18));
            }}
            color='yellow.500'
            border='none'
            size='lg'
            fontSize='1rem'
            fontFamily='texturina'
          >
            Payment #{i + 1} &nbsp; &nbsp;
            {formatUnits(BigInt(a), 18)} {parseTokenAddress(chainId, token)}
          </Checkbox>
        ))}
      </VStack>

      <Text variant='textOne'>OR</Text>

      <VStack
        spacing='0.5rem'
        align='stretch'
        color='primary.500'
        mb='1rem'
        fontFamily='texturina'
      >
        <Flex justify='space-between' w='100%'>
          <Text fontWeight='500'>Enter a Manual Deposit Amount</Text>
          {paymentType === 1 && (
            <Tooltip
              label={`Your ${NATIVE_TOKEN_SYMBOL} will be automagically wrapped to ${parseTokenAddress(
                chainId,
                token
              )} tokens`}
              placement='auto-start'
            >
              <QuestionIcon ml='1rem' boxSize='0.75rem' />
            </Tooltip>
          )}
        </Flex>
        <InputGroup>
          <Input
            bg='black'
            color='white'
            border='none'
            type='number'
            value={amountInput}
            onChange={(e) => {
              const newAmountInput = e.target.value;
              setAmountInput(newAmountInput);
              if (newAmountInput) {
                const newAmount = parseUnits(newAmountInput, 18);
                setAmount(newAmount);
                setChecked(
                  getCheckedStatus(BigInt(deposited) + newAmount, amounts)
                );
              } else {
                setAmount(BigInt(0));
                setChecked(initialStatus);
              }
            }}
            placeholder='Value..'
            pr={isWRAPPED ? '6rem' : '3.5rem'}
          />
          <InputRightElement w={isWRAPPED ? '6rem' : '3.5rem'}>
            {isWRAPPED ? (
              <Select
                onChange={(e: any) => setPaymentType(Number(e.target.value))}
                value={paymentType}
                bg='black'
                color='primary.300'
                border='none'
              >
                <option value='0'>{parseTokenAddress(chainId, token)}</option>
                <option value='1'>{NATIVE_TOKEN_SYMBOL}</option>
              </Select>
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
        w='100%'
        fontSize='sm'
        fontFamily='texturina'
      >
        {deposited && (
          <VStack align='flex-start'>
            <Text fontWeight='bold'>Total Deposited</Text>
            <Text>
              {`${formatUnits(BigInt(deposited), 18)} ${parseTokenAddress(
                chainId,
                token
              )}`}
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
        {balance && (
          <VStack align='flex-end'>
            <Text fontWeight='bold'>Your Balance</Text>
            <Text>
              {/* {`${formatUnits(balance, 18)} ${
                paymentType === 0
                  ? parseTokenAddress(chainId, token)
                  : NATIVE_TOKEN_SYMBOL
              }`} */}
              Test
            </Text>
          </VStack>
        )}
      </Flex>
      {loading && <Loader />}

      {!loading && (
        <Button
          onClick={writeAsync}
          isDisabled={amount <= 0}
          textTransform='uppercase'
          variant='solid'
        >
          Deposit
        </Button>
      )}
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
    </VStack>
  );
};

export default DepositFunds;
