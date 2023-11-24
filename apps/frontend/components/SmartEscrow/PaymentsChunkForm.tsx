import {
  Box,
  Button,
  ChakraInput,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@raidguild/design-system';
import { commify } from '@raidguild/dm-utils';
import { Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { IoCloseCircle } from 'react-icons/io5';

// TODO migrate to design system

const PaymentsChunkForm = ({
  escrowForm,
  updateStep,
  backStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: () => void;
  backStep: () => void;
}) => {
  const { watch, setValue } = escrowForm;
  const { total, milestones, token, payments: escrowPayments } = watch();
  const localForm = useForm();
  const {
    setValue: localSetValue,
    handleSubmit,
    watch: localWatch,
  } = localForm;
  const payments = localWatch('payments');

  const sum = _.sumBy(payments, _.toNumber);

  const onSubmit = (values: Partial<Invoice>) => {
    // set values in escrow form
    setValue('payments', values.payments);

    // navigate form
    updateStep();
  };

  const paymentsEqual = sum === _.toNumber(total);

  useEffect(() => {
    if (escrowPayments) {
      localSetValue('payments', escrowPayments);
      return;
    }
    localSetValue('payments', new Array(_.toNumber(milestones)).fill(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      as='form'
      onSubmit={handleSubmit(onSubmit)}
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='40%'
    >
      <Stack>
        {_.map(payments, (payment, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FormControl key={index} isRequired>
            <FormLabel>{`Payment #${index + 1}`}</FormLabel>
            <InputGroup>
              <ChakraInput
                focusBorderColor='none'
                name={`payment${index + 1}`}
                type='number'
                onChange={(e) => {
                  const temp = [...payments];
                  temp[index] = e.target.value;
                  localSetValue('payments', temp);
                }}
                value={payment}
              />
              <InputRightElement
                fontFamily='texturina'
                color='yellow.500'
                w='3.5rem'
                mr='.5rem'
              >
                {token}
              </InputRightElement>
            </InputGroup>
          </FormControl>
        ))}

        <Flex justify='space-between'>
          <Text color='white' textTransform='uppercase' fontFamily='texturina'>
            The sum should add up to {commify(total)} {token}
          </Text>

          <HStack align='center'>
            <Box height='16px'>
              <Icon
                as={paymentsEqual ? FaCheckCircle : IoCloseCircle}
                color={paymentsEqual ? 'green.500' : 'red.500'}
              />
            </Box>
            <Text>Total: {commify(sum)}</Text>
          </HStack>
        </Flex>
      </Stack>

      <Flex direction='row' width='100%' mt='1rem'>
        <Button
          variant='outline'
          minW='25%'
          p='5px'
          mr='.5rem'
          onClick={backStep}
        >
          Back
        </Button>
        <Button
          type='submit'
          variant='solid'
          width='100%'
          isDisabled={
            _.size(payments) !== _.toNumber(milestones) || !paymentsEqual
          }
        >
          Next: Confirmation
        </Button>
      </Flex>
    </Flex>
  );
};

export default PaymentsChunkForm;
