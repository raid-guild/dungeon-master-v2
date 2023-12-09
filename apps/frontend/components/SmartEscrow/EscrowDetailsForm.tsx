import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  ChakraInput,
  Checkbox,
  DatePicker,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  // NumberInput,
  // RadioBox,
  Stack,
} from '@raidguild/design-system';
import { SUPPORTED_NETWORKS } from '@raidguild/escrow-gql';
import { getResolverUrl, getSpoilsUrl, Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';
import * as Yup from 'yup';

// TODO migrate to design system
// TODO migrate to react-hook-form

const unsupportedNetwork = (chainId: number) =>
  !_.includes(SUPPORTED_NETWORKS, chainId);

const schema = Yup.object().shape({
  client: Yup.string().required('Client address is required'),
  // TODO handle nested when for provider !== client
  provider: Yup.string().when(
    'raidPartySplit',
    (raidPartySplit, localSchema) => {
      if (_.first(raidPartySplit)) return localSchema;
      return localSchema.required('Raid party address is required');
    }
  ),
  safetyValveDate: Yup.date()
    .required('Safety valve date is required')
    .min(new Date(), 'Safety valve date must be in the future'),
  daoSplit: Yup.boolean().required('DAO split is required'),
  spoilsPercent: Yup.string(),
  raidPartySplit: Yup.boolean().required('Raid party split is required'),
});

const EscrowDetailsForm = ({
  escrowForm,
  updateStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: (i?: number) => void;
}) => {
  const chainId = useChainId();
  const { watch, setValue } = escrowForm;
  const { provider, client, safetyValveDate, raidPartySplit, daoSplit } =
    watch();
  const localForm = useForm({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    setValue: localSetValue,
    watch: localWatch,
  } = localForm;
  const {
    safetyValveDate: localSafetyValveDate,
    daoSplit: localDaoSplit,
    spoilsPercent: localSpoilsPercent,
    raidPartySplit: localRaidPartySplit,
  } = localWatch();

  const onSubmit = (values: Partial<Invoice>) => {
    // update values in escrow form
    setValue('client', values.client);
    setValue('provider', values.provider);
    setValue('safetyValveDate', values.safetyValveDate);
    setValue('raidPartySplit', values.raidPartySplit);
    setValue('daoSplit', values.daoSplit);

    // move form
    if (localRaidPartySplit) updateStep(1);
    else updateStep(2);
  };

  useEffect(() => {
    // set initial local values
    if (client) localSetValue('client', client);
    if (provider) localSetValue('provider', provider);
    localSetValue('safetyValveDate', safetyValveDate || new Date());
    if (_.isUndefined(raidPartySplit)) localSetValue('raidPartySplit', true);
    else localSetValue('raidPartySplit', raidPartySplit);
    if (_.isUndefined(daoSplit)) localSetValue('daoSplit', true);
    else localSetValue('daoSplit', daoSplit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  useEffect(() => {
    localSetValue('spoilsPercent', localDaoSplit ? '10' : '0');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDaoSplit]);

  return (
    <Card as='form' onSubmit={handleSubmit(onSubmit)} variant='filled' p={6}>
      <Stack spacing={4} w='100%'>
        <Stack spacing={4}>
          <Input
            label='Client Address'
            tooltip='This will be the address used to access the invoice'
            placeholder='0x...'
            name='client'
            localForm={localForm}
          />
        </Stack>

        <Flex>
          <Box w='33%'>
            <DatePicker
              label='Safety Valve Date'
              name='safetyValveDate'
              // tooltip='The funds can be withdrawn by the client after 00:00:00 GMT on this date'
              onChange={(date) => {
                localSetValue('safetyValveDate', date as Date);
              }}
              selected={localSafetyValveDate}
              localForm={localForm}
            />
          </Box>

          <Stack w='33%'>
            <Checkbox
              label='Raid Party Split'
              name='raidPartySplit'
              localForm={localForm}
              options={['Add Raid Party split']}
            />
          </Stack>
          <Stack w='33%'>
            <Checkbox
              label='DAO Split'
              name='daoSplit'
              localForm={localForm}
              options={['Add DAO spoils split']}
            />
          </Stack>
        </Flex>

        {!localRaidPartySplit && (
          <Flex>
            <Input
              label='Raid Party Address'
              tooltip='Recipient of the funds'
              placeholder='0x...'
              name='provider'
              localForm={localForm}
              registerOptions={{ required: true }}
            />
          </Flex>
        )}

        <Flex>
          <FormControl isReadOnly mr='.5em'>
            <Link href={getResolverUrl(chainId)} isExternal>
              <FormLabel cursor='pointer' fontWeight='bold'>
                Arbitration Provider
              </FormLabel>
            </Link>
            <ChakraInput
              value={localDaoSplit ? 'LexDAO' : 'RaidGuild DAO'}
              isDisabled
            />
          </FormControl>

          <FormControl isReadOnly mr='.5em'>
            <Link href={getSpoilsUrl(chainId, provider)} isExternal>
              <FormLabel cursor='pointer' fontWeight='bold'>
                Spoils Percent
              </FormLabel>
            </Link>
            <ChakraInput value={`${localSpoilsPercent}%`} readOnly isDisabled />
          </FormControl>
        </Flex>

        <Flex justify='center'>
          <Button
            type='submit'
            variant='solid'
            isDisabled={unsupportedNetwork(chainId)}
          >
            Next:{' '}
            {localRaidPartySplit
              ? 'Set Raid Party Split'
              : 'Set Payment Amounts'}
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};

export default EscrowDetailsForm;
