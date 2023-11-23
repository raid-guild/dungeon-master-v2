import {
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  Link,
  RadioBox,
  NumberInput,
  ChakraInput,
  DatePicker,
} from '@raidguild/design-system';
import { getResolverUrl, getSpoilsUrl } from '@raidguild/escrow-utils';
import { SUPPORTED_NETWORKS } from '@raidguild/escrow-gql';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useChainId } from 'wagmi';

// TODO migrate to design system
// TODO migrate to react-hook-form

const tokens = (chainId: number) => {
  if (chainId === 100) {
    return ['WETH', 'WXDAI'];
  } else if (chainId === 1) {
    return ['WETH', 'DAI'];
  } else {
    return ['WETH', 'DAI', 'TEST'];
  }
};

const unsupportedNetwork = (chainId: number) => {
  return SUPPORTED_NETWORKS.indexOf(chainId) === -1;
};

// if (SUPPORTED_NETWORKS.indexOf(parseInt(appState.chainId)) === -1)
//   return sendToast('Switch to a supported network.');
// if (!utils.isAddress(client)) return sendToast('Invalid Client Address.');
// if (!utils.isAddress(serviceProvider))
//   return sendToast('Invalid Raid Party Address.');
// if (client === serviceProvider)
//   return sendToast('Client and Raid party address cannot be the same.');
// if (tokenType === '') return sendToast('Select a Payment Token.');
// if (paymentDue <= 0 || paymentDue === '')
//   return sendToast('Invalid Payment Due Amount.');
// if (!selectedDay) return sendToast('Safety valve date required.');
// if (new Date(selectedDay).getTime() < new Date().getTime())
//   return sendToast('Safety valve date needs to be in future.');

export const PaymentDetailsForm = ({
  escrowForm,
  updateStep,
  backStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: () => void;
  backStep: () => void;
}) => {
  const chainId = useChainId();
  const { watch, setValue } = escrowForm;
  const localForm = useForm();
  const { handleSubmit } = localForm;

  const serviceProvider = watch('serviceProvider');

  const onSubmit = (values: object) => {
    console.log(values);
    setValue('paymentToken', tokens(chainId)[0]);
    updateStep();
  };

  return (
    <Flex
      as='form'
      onSubmit={handleSubmit(onSubmit)}
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <FormControl isRequired>
        <Input
          label='Client Address'
          tooltip='This will be the address used to access the invoice'
          name='client'
          localForm={localForm}
        />
      </FormControl>

      <FormControl isRequired>
        <Input
          label='Raid Party Address'
          tooltip='Recipient of the funds'
          name='serviceProvider'
          localForm={localForm}
        />
      </FormControl>

      <Flex direction='row'>
        <FormControl isRequired>
          <RadioBox
            options={tokens}
            label='Payment Token'
            name='paymentToken'
            localForm={localForm}
          />
        </FormControl>
        <FormControl isRequired mr='.5em'>
          <NumberInput
            label='Total Payment Due'
            name='paymentDue'
            min={1}
            localForm={localForm}
          />
        </FormControl>
        <FormControl isRequired>
          <NumberInput
            label='No of Payments'
            name='milestones'
            // tooltip='Number of milestones in which the total payment will be processed'
            min={1}
            localForm={localForm}
          />
        </FormControl>
      </Flex>

      <Flex direction='row'>
        <FormControl isReadOnly mr='.5em'>
          <Link href={getResolverUrl(chainId)} isExternal>
            <FormLabel cursor='pointer' fontWeight='bold'>
              Arbitration Provider
            </FormLabel>
          </Link>
          <ChakraInput value='LexDAO' isDisabled />
        </FormControl>

        <FormControl isReadOnly mr='.5em'>
          <Link href={getSpoilsUrl(chainId, serviceProvider)} isExternal>
            <FormLabel cursor='pointer' fontWeight='bold'>
              Spoils Percent
            </FormLabel>
          </Link>
          <ChakraInput value='10%' readOnly isDisabled />
        </FormControl>

        <FormControl isRequired>
          <DatePicker
            label='Safety Valve Date'
            name='safetyValveDate'
            // tooltip='The funds can be withdrawn by the client after 00:00:00 GMT on this date'
            onChange={(date) => {
              setValue('safetyValveDate', date);
            }}
            selected={watch('safetyValveDate')}
            localForm={localForm}
          />
        </FormControl>
      </Flex>

      <Flex justify='center'>
        <Button
          type='submit'
          variant='solid'
          isDisabled={unsupportedNetwork(chainId)}
        >
          Next: Set Payment Amounts
        </Button>
      </Flex>
    </Flex>
  );
};
