import {
  Button,
  ChakraInput,
  DatePicker,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  NumberInput,
  RadioBox,
  Stack,
} from '@raidguild/design-system';
import { SUPPORTED_NETWORKS } from '@raidguild/escrow-gql';
import { getResolverUrl, getSpoilsUrl, Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';

// TODO migrate to design system
// TODO migrate to react-hook-form

const tokens = (chainId: number) => {
  if (chainId === 100) {
    return ['WETH', 'WXDAI'];
  }
  if (chainId === 1) {
    return ['WETH', 'DAI'];
  }
  return ['WETH', 'DAI', 'TEST'];
};

console.log('SUPPORTED_NETWORKS', SUPPORTED_NETWORKS);
const unsupportedNetwork = (chainId: number) =>
  !_.includes(SUPPORTED_NETWORKS, chainId);

// if (SUPPORTED_NETWORKS.indexOf(parseInt(appState.chainId)) === -1)
//   return sendToast('Switch to a supported network.');
// if (!isAddress(client)) return sendToast('Invalid Client Address.');
// if (!isAddress(serviceProvider))
//   return sendToast('Invalid Raid Party Address.');
// if (client === serviceProvider)
//   return sendToast('Client and Raid party address cannot be the same.');
// if (tokenType === '') return sendToast('Select a Payment Token.');
// if (paymentDue <= 0 || paymentDue === '')
//   return sendToast('Invalid Payment Due Amount.');
// if (!selectedDay) return sendToast('Safety valve date required.');
// if (new Date(selectedDay).getTime() < new Date().getTime())
//   return sendToast('Safety valve date needs to be in future.');

const PaymentDetailsForm = ({
  escrowForm,
  updateStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: () => void;
}) => {
  const chainId = useChainId();
  const { watch, setValue } = escrowForm;
  const { total, provider, client, token, safetyValveDate, milestones } =
    watch();
  const localForm = useForm();
  const {
    handleSubmit,
    setValue: localSetValue,
    watch: localWatch,
  } = localForm;
  const { safetyValveDate: localSafetyValveDate } = localWatch();

  const onSubmit = (values: Partial<Invoice>) => {
    // update values in escrow form
    setValue('client', values.client);
    setValue('provider', values.provider);
    setValue('token', values.token);
    setValue('total', values.total);
    setValue('milestones', values.milestones);
    setValue('safetyValveDate', values.safetyValveDate);

    // move form
    updateStep();
  };

  useEffect(() => {
    // set initial local values
    if (client) localSetValue('client', client);
    if (provider) localSetValue('provider', provider);
    localSetValue('total', total || 10000);
    localSetValue('milestones', milestones || 1);
    localSetValue('token', token || tokens(chainId)[0]);
    localSetValue('safetyValveDate', safetyValveDate || new Date());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <Flex
      as='form'
      onSubmit={handleSubmit(onSubmit)}
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='70%'
    >
      <Stack spacing={4}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <Input
              label='Client Address'
              tooltip='This will be the address used to access the invoice'
              placeholder='0x...'
              name='client'
              localForm={localForm}
            />
          </FormControl>

          <FormControl isRequired>
            <Input
              label='Raid Party Address'
              tooltip='Recipient of the funds'
              placeholder='0x...'
              name='provider'
              localForm={localForm}
            />
          </FormControl>
        </Stack>

        <Flex direction='row'>
          <FormControl isRequired>
            <RadioBox
              options={tokens(chainId)}
              label='Payment Token'
              name='token'
              localForm={localForm}
            />
          </FormControl>
          <FormControl isRequired mr='.5em'>
            <NumberInput
              label='Total Payment Due'
              name='total'
              placeholder='5000'
              min={1}
              max={250000}
              variant='outline'
              localForm={localForm}
            />
          </FormControl>
          <FormControl isRequired>
            <NumberInput
              label='No of Payments'
              name='milestones'
              placeholder='3'
              // tooltip='Number of milestones in which the total payment will be processed'
              min={1}
              variant='outline'
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
            <Link href={getSpoilsUrl(chainId, provider)} isExternal>
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
                localSetValue('safetyValveDate', date);
              }}
              selected={localSafetyValveDate}
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
      </Stack>
    </Flex>
  );
};

export default PaymentDetailsForm;
