import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  ChakraSwitch as Switch,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  NumberInput,
  Stack,
  Text,
  Tooltip,
} from '@raidguild/design-system';
import { SUPPORTED_NETWORKS } from '@raidguild/escrow-gql';
import _ from 'lodash';
import { useEffect } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { FaInfoCircle, FaPlusCircle, FaRegTrashAlt } from 'react-icons/fa';
import { isAddress } from 'viem';
import { useChainId } from 'wagmi';
import * as Yup from 'yup';

interface RaidPartySplitFormProps {
  escrowForm: UseFormReturn<any>;
  updateStep: () => void;
  backStep: () => void;
}

const unsupportedNetwork = (chainId: number) =>
  !_.includes(SUPPORTED_NETWORKS, chainId);

const schema = Yup.object().shape({
  ownersAndAllocations: Yup.array().of(
    Yup.object().shape({
      address: Yup.string()
        .required('Address is required')
        .test('valid-address', 'Address is invalid', (value) =>
          isAddress(value)
        ),
      percent: Yup.string().required('Percent Allocation is required'),
    })
  ),
  threshold: Yup.number().when('haveSafe', (haveSafe, localSchema) => {
    if (!_.first(haveSafe)) return localSchema;
    return localSchema.required('Threshold is required');
  }),
  haveSafe: Yup.boolean().required(),
  provider: Yup.string().when('haveSafe', (haveSafe, localSchema) => {
    if (!_.first(haveSafe)) return localSchema;
    return localSchema.required('Safe Address is required');
  }),
});

const RaidPartySplitForm = ({
  escrowForm,
  updateStep,
  backStep,
}: RaidPartySplitFormProps) => {
  const chainId = useChainId();
  const { setValue, watch } = escrowForm;
  const { threshold, ownersAndAllocations, provider } = watch();
  const localForm = useForm({
    mode: 'onChange',
    defaultValues: {
      ownersAndAllocations: [
        { address: '', percent: '50' },
        { address: '', percent: '50' },
      ],
      threshold: 1,
      haveSafe: !!provider,
    },
    resolver: yupResolver(schema),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue: localSetValue,
    watch: localWatch,
    getValues,
  } = localForm;
  const { ownersAndAllocations: localOwnersAndAllocations, haveSafe } =
    localWatch();
  console.log(watch('raidPartySplit'));

  const {
    fields: ownersAndAllocationsFields,
    append: appendOwnerAndAllocation,
    remove: removeOwnerAndAllocation,
  } = useFieldArray({
    name: 'ownersAndAllocations',
    control,
  });
  const percentAllocated = _.sumBy(
    localOwnersAndAllocations,
    (owner: { percent: string }) => _.toNumber(owner.percent) || 0
  );

  const updateEscrowForm = (values: any) => {
    // update values in escrow form
    setValue('ownersAndAllocations', values.ownersAndAllocations);
    setValue('threshold', values.threshold);
    setValue('provider', values.provider);
  };

  const onSubmit = (values: any) => {
    updateEscrowForm(values);

    // move form
    updateStep();
  };

  const backHandler = () => {
    const values = getValues();
    updateEscrowForm(values);
    backStep();
  };

  useEffect(() => {
    if (ownersAndAllocations) {
      localSetValue('ownersAndAllocations', ownersAndAllocations);
      localSetValue('threshold', threshold);
    }
    if (provider) {
      localSetValue('provider', provider);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card variant='filled' p={6}>
      <Stack w='100%' as='form' onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Heading size='sm'>Owners & Percent Allocations</Heading>
          <Tooltip
            label='Will be set as the initial split allocation for the first milestone release'
            placement='right'
            hasArrow
            shouldWrapChildren
          >
            <Icon
              as={FaInfoCircle}
              boxSize={3}
              color='purple.500'
              bg='white'
              borderRadius='full'
            />
          </Tooltip>
        </HStack>

        {_.map(ownersAndAllocationsFields, (field, index) => {
          const removeOwner = () => {
            removeOwnerAndAllocation(index);
          };

          return (
            <HStack align='flex-start' key={field.id} position='relative'>
              <Stack w='45%'>
                <Input
                  label={`Owner ${index + 1}`}
                  name={`ownersAndAllocations[${index}].address`}
                  placeholder='0x'
                  variant='outline'
                  localForm={localForm}
                />
                {errors.ownersAndAllocations?.[index]?.address?.message && (
                  <Text color='red.500'>
                    {errors.ownersAndAllocations?.[index]?.address?.message}
                  </Text>
                )}
              </Stack>
              <Stack w='45%'>
                <NumberInput
                  label={`Percent Allocation ${index + 1}`}
                  name={`ownersAndAllocations[${index}].percent`}
                  step={5}
                  min={0}
                  max={100}
                  placeholder='40'
                  variant='outline'
                  localForm={localForm}
                />
                {errors.ownersAndAllocations?.[index]?.percent?.message && (
                  <Text color='red.500'>
                    {errors.ownersAndAllocations?.[index]?.percent?.message}
                  </Text>
                )}
              </Stack>
              <Box
                // a bit hacky here to keep the alignment
                my={errors.ownersAndAllocations?.[index] && 'auto'}
                position={
                  !errors.ownersAndAllocations?.[index] ? 'absolute' : 'inherit'
                }
                bottom={0}
                right={!errors.ownersAndAllocations?.[index] && 1}
              >
                <IconButton
                  icon={<Icon as={FaRegTrashAlt} />}
                  aria-label='remove owner'
                  variant='outline'
                  onClick={removeOwner}
                />
              </Box>
            </HStack>
          );
        })}
        <Flex justify='space-between' align='flex-end'>
          <Button
            variant='outline'
            onClick={() => {
              appendOwnerAndAllocation({ address: '', percent: '0' });
            }}
            isDisabled={percentAllocated >= 100}
            rightIcon={<Icon as={FaPlusCircle} />}
          >
            Add
          </Button>

          <Text
            color={percentAllocated !== 100 && 'red.500'}
            fontWeight={percentAllocated !== 100 && 700}
          >
            Total Percent Allocation: {percentAllocated}%
          </Text>
        </Flex>

        <HStack>
          <Text>Do you have a Safe?</Text>
          <Switch
            isChecked={haveSafe}
            onChange={() => localSetValue('haveSafe', !haveSafe)}
          />
          <Text>{haveSafe ? 'Yes' : 'No'}</Text>
        </HStack>

        <Flex>
          {haveSafe ? (
            <Input
              label='Safe Address'
              tooltip='This address can update the split allocation for each milestone'
              name='provider'
              placeholder='0x...'
              localForm={localForm}
            />
          ) : (
            <NumberInput
              name='threshold'
              label={`Safe Threshold (out of ${localOwnersAndAllocations?.length})`}
              // tooltip='The minimum number of owners required to update the split allocation'
              min={1}
              max={localOwnersAndAllocations?.length || 1}
              step={1}
              variant='outline'
              localForm={localForm}
              // registerOptions={{ required: true }}
            />
          )}
        </Flex>

        <Flex justify='center' pt={6}>
          <HStack>
            <Button variant='outline' onClick={backHandler}>
              Back
            </Button>
            s
            <Button
              type='submit'
              variant='solid'
              isDisabled={
                unsupportedNetwork(chainId) ||
                !!errors.ownersAndAllocations ||
                percentAllocated !== 100
              }
            >
              Next: Set Payment Amounts
            </Button>
          </HStack>
        </Flex>
      </Stack>
    </Card>
  );
};

export default RaidPartySplitForm;
