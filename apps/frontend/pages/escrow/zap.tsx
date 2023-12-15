import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  DatePicker,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Link,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
} from '@raidguild/design-system';
import { useEscrowZap } from '@raidguild/escrow-hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { FaPlusCircle, FaRegTrashAlt } from 'react-icons/fa';
import { decodeAbiParameters, Hex, isAddress, zeroAddress } from 'viem';
import { useNetwork, useWaitForTransaction } from 'wagmi';
import * as Yup from 'yup';

import SiteLayout from '../../components/SiteLayout';

const ARBITRATION_OPTIONS = [
  {
    label: 'Individual',
    value: 0,
  },
  {
    label: 'Arbitrator',
    value: 1,
  },
];

const TOKEN_OPTIONS = {
  1: [],
  5: [
    {
      label: 'Wrapped xDai',
      value: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    },
    {
      label: 'Wrapped Ether',
      value: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
    },
  ],
  10: [],
  100: [
    {
      label: 'Wrapped xDai',
      value: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    },
    {
      label: 'Wrapped Ether',
      value: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
    },
  ],
};

const SAFE_URL = 'https://app.safe.global/home';
const SPLITS_URL = 'https://app.0xsplits.org';
// const ESCROW_URL =

const validationSchema = Yup.object().shape({
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
  milestones: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().required('Milestone Amount is required'),
    })
  ),
  client: Yup.string().required('Client Address is required'),
  resolver: Yup.string().required('Resolver Address is required'),
  threshold: Yup.number().required('Threshold is required'),
  arbitration: Yup.object().shape({
    label: Yup.string(),
    value: Yup.number().required(),
  }),
  isDaoSplit: Yup.boolean(),
  token: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string().required(),
  }),
  escrowDeadline: Yup.number().required('Escrow Deadline is required'),
  details: Yup.string(),
});

const EscrowZap = () => {
  const [hash, setHash] = useState<`0x${string}`>();
  const localForm = useForm({
    defaultValues: {
      ownersAndAllocations: [{ address: '', percent: '' }],
      milestones: [{ value: '1000' }],
    },
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const { chain } = useNetwork();

  const {
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = localForm;

  const { data } = useWaitForTransaction({
    hash,
  });
  let addresses: Hex[];
  if (data?.logs?.[6]?.data) {
    addresses = decodeAbiParameters(
      ['address', 'address', 'address', 'address'],
      data?.logs?.[6]?.data
    ) as Hex[];
  }
  const [safe, projectTeamSplit, daoSplit, escrow] = addresses || [];

  const {
    fields: ownersAndAllocationsFields,
    append: appendOwnerAndAllocation,
    remove: removeOwnerAndAllocation,
  } = useFieldArray({
    name: 'ownersAndAllocations',
    control,
    rules: {
      validate: (value) => {
        console.log(value);
        return true;
        // return isAddress(value);
      },
    },
  });
  const {
    fields: milestonesFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    name: 'milestones',
    control,
  });

  const client = watch('client');
  const resolver = watch('resolver');
  const threshold = watch('threshold');
  const arbitration = watch('arbitration');
  const token = watch('token');
  const escrowDeadline = watch('escrowDeadline');
  const isDaoSplit = watch('isDaoSplit');
  const ownersAndAllocations = watch('ownersAndAllocations');
  const milestones = watch('milestones');
  console.log(isDaoSplit);

  // TODO handle details pin
  // TODO check decimals on token/milestones
  const { writeAsync } = useEscrowZap({
    ownersAndAllocations,
    milestones,
    client,
    resolver,
    threshold,
    arbitration,
    isDaoSplit,
    token,
    escrowDeadline,
    details: 'ipfs://',
  });

  const onSubmit = async (_data: FieldValues) => {
    console.log(_data);

    const result = await writeAsync?.();

    setHash(result?.hash);
  };

  useEffect(() => {
    reset({
      threshold: 2,
      arbitration: ARBITRATION_OPTIONS[0],
      token: TOKEN_OPTIONS[chain.id][0],
      isDaoSplit: false,
      // 30 days from now
      escrowDeadline:
        Math.floor(new Date().getTime()) + 30 * 24 * 60 * 60 * 1000,
    });
  }, []);

  const percentAllocated = _.sumBy(
    ownersAndAllocations,
    (owner: { percent: string }) => _.toNumber(owner.percent) || 0
  );

  return (
    <SiteLayout>
      <Heading>Escrow Zap</Heading>
      <Box
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        w={['90%', null, null, '60%']}
      >
        <Stack spacing={6}>
          <Input
            name='client'
            label='Client Address'
            placeholder='0x'
            variant='outline'
            isRequired
            localForm={localForm}
          />
          <Stack>
            <Heading size='sm'>Owners & Percent Allocations</Heading>

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
                      !errors.ownersAndAllocations?.[index]
                        ? 'absolute'
                        : 'inherit'
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
                  appendOwnerAndAllocation({ address: '', percent: '' });
                }}
                isDisabled={percentAllocated >= 100}
                rightIcon={<Icon as={FaPlusCircle} />}
              >
                Add
              </Button>

              <Text color={percentAllocated !== 100 && 'red.500'}>
                Total Percent Allocation:{' '}
                {_.sumBy(
                  ownersAndAllocations,
                  (owner) => _.toNumber(owner.percent) || 0
                )}
              </Text>
            </Flex>
          </Stack>
          <NumberInput
            name='threshold'
            label={`Threshold (out of ${ownersAndAllocations?.length})`}
            min={1}
            max={ownersAndAllocations?.length || 1}
            step={1}
            variant='outline'
            localForm={localForm}
          />
          <Select
            name='token'
            label='Token'
            variant='outline'
            options={TOKEN_OPTIONS[chain?.id]}
            localForm={localForm}
          />
          <Stack>
            <Heading size='sm'>Milestone Amounts</Heading>
            {_.map(milestonesFields, (field, index) => {
              const handleRemoveMilestone = () => {
                console.log(index);
                removeMilestone(index);
              };
              return (
                <HStack key={field.id}>
                  <NumberInput
                    name={`milestones.${index}.value`}
                    step={50}
                    min={0}
                    max={1_000_000}
                    placeholder='500'
                    variant='outline'
                    localForm={localForm}
                  />
                  <IconButton
                    icon={<Icon as={FaRegTrashAlt} />}
                    aria-label='remove milestone'
                    variant='outline'
                    onClick={handleRemoveMilestone}
                  />
                </HStack>
              );
            })}
            <Flex justify='space-between' align='flex-end'>
              <Button
                variant='outline'
                onClick={() => {
                  appendMilestone({ value: '1000' });
                }}
                rightIcon={<Icon as={FaPlusCircle} />}
              >
                Add
              </Button>
              <Text>
                Total:{' '}
                {/* {_.toLocaleString(
                  _.sumBy(
                    milestones,
                    (milestone) => _.toNumber(milestone.value) || 0
                  )
                )}{' '} */}
                {token?.label}
              </Text>
            </Flex>
          </Stack>
          <DatePicker
            label='Escrow Deadline'
            name='escrowDeadline'
            localForm={localForm}
            onChange={(value) => {
              const newDate = value;
              if (_.isDate(newDate) && !_.isArray(newDate)) {
                setValue('escrowDeadline', (newDate as Date).getTime());
              }
            }}
          />

          <Switch
            name='isDaoSplit'
            label='DAO Split?'
            localForm={localForm}
            defaultChecked={false}
          />
          <Text fontSize='sm'>Hide these two</Text>
          <Input
            name='resolver'
            label='Resolver Address'
            placeholder='0x'
            variant='outline'
            isRequired
            localForm={localForm}
          />
          <Select
            name='arbitration'
            label='Arbitration'
            variant='outline'
            options={ARBITRATION_OPTIONS}
            localForm={localForm}
          />

          <Flex justify='flex-end'>
            <Button type='submit' variant='outline' isDisabled={!writeAsync}>
              Submit
            </Button>
          </Flex>
        </Stack>
        {addresses && (
          <Card bg='purple.300'>
            <Stack>
              <Heading size='md'>Safe, Split(s) & Escrow created</Heading>
              <Text>
                Safe:{' '}
                <Link
                  href={`${SAFE_URL}?safe=${chain.name.slice(0, 3)}:${safe}`}
                  isExternal
                >
                  {safe}
                </Link>
              </Text>
              <Text>
                Project Team Split:{' '}
                <Link
                  href={`${SPLITS_URL}/accounts/${projectTeamSplit}?chainId=${chain.id}`}
                  isExternal
                >
                  {projectTeamSplit}
                </Link>
              </Text>
              {daoSplit !== zeroAddress && (
                <Text>
                  DAO Split:{' '}
                  <Link
                    href={`${SPLITS_URL}/accounts/${daoSplit}?chainId=${chain.id}`}
                    isExternal
                  >
                    {daoSplit}
                  </Link>
                </Text>
              )}
              <Text>
                Escrow:{' '}
                <Link
                  href={`${
                    chain.blockExplorers?.etherscan ||
                    chain.blockExplorers?.default
                  }/address/${escrow}`}
                >
                  {escrow}
                </Link>
              </Text>
            </Stack>
          </Card>
        )}
        <DevTool control={control} />
      </Box>
    </SiteLayout>
  );
};

export default EscrowZap;