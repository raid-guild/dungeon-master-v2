import React, { useEffect, useState } from 'react';
import SiteLayout from '../components/SiteLayout';
import {
  Heading,
  Stack,
  Box,
  NumberInput,
  Select,
  Switch,
  Input,
  Button,
  Flex,
  Text,
  HStack,
  IconButton,
  Icon,
} from '@raidguild/design-system';
import { FieldValues, useForm, useFieldArray } from 'react-hook-form';
import { ethers, BigNumber } from 'ethers';
import { useEscrowZap } from '@raidguild/dm-hooks';
import _ from 'lodash';
import { isAddress } from '@ethersproject/address';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FaPlusCircle, FaRegTrashAlt } from 'react-icons/fa';
import { DevTool } from '@hookform/devtools';

const arbitrationOptions = [
  {
    label: 'Something',
    value: 1,
  },
  {
    label: 'Other',
    value: 2,
  },
];

const tokenOptions = [
  {
    label: 'Wrapped Ether',
    value: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  },
];

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

// ! resolver should be lexdao for DAO split
// ! resolver should be dao for non DAO split

const EscrowZap = () => {
  const localForm = useForm({
    defaultValues: {
      ownersAndAllocations: [{ address: '', percent: '0' }],
    },
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    reset,
    watch,
    control,
    register,
    formState: { errors },
  } = localForm;

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
  // console.log(ownersAndAllocations);

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

  const onSubmit = (data: FieldValues) => {
    console.log(data);

    writeAsync?.();
  };

  // handle pin to ipfs

  useEffect(() => {
    reset({
      threshold: 2,
      arbitration: arbitrationOptions[0],
      token: tokenOptions[0],
      isDaoSplit: false,
    });
  }, []);

  return (
    <SiteLayout>
      <Heading>Escrow Zap</Heading>
      <Box
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        w={['90%', null, null, '60%']}
      >
        <Stack spacing={6}>
          <Stack>
            <Heading size='sm'>Owners & Percent Allocations</Heading>

            {_.map(ownersAndAllocationsFields, (field, index) => {
              const removeOwner = () => {
                console.log(index);
                removeOwnerAndAllocation(index);
              };

              return (
                <HStack align='flex-start' key={field.id}>
                  <Stack w='45%'>
                    <Input
                      label={`Owner ${index + 1}`}
                      name={`ownersAndAllocations[${index}].address`}
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
                      {...register(`ownersAndAllocations.${index}.percent`)}
                      step={5}
                      min={0}
                      max={100}
                      variant='outline'
                      localForm={localForm}
                    />
                    {errors.ownersAndAllocations?.[index]?.percent?.message && (
                      <Text color='red.500'>
                        {errors.ownersAndAllocations?.[index]?.percent?.message}
                      </Text>
                    )}
                  </Stack>
                  <IconButton
                    icon={<Icon as={FaRegTrashAlt} />}
                    aria-label='remove item'
                    onClick={removeOwner}
                    my='auto'
                  />
                </HStack>
              );
            })}
            <Flex>
              <Button
                onClick={() => {
                  appendOwnerAndAllocation({ address: '', percent: '0' });
                }}
                rightIcon={<Icon as={FaPlusCircle} />}
              >
                Add
              </Button>
            </Flex>
          </Stack>
          <Stack>
            <Heading size='sm'>Milestone Amounts</Heading>
            {_.map(milestonesFields, (field, index) => {
              return (
                <Input
                  key={field.id}
                  name={`milestones.${index}.value`}
                  variant='outline'
                  localForm={localForm}
                />
              );
            })}
            <Flex>
              <Button
                onClick={() => {
                  appendMilestone({ value: '0' });
                }}
                rightIcon={<Icon as={FaPlusCircle} />}
              >
                Add
              </Button>
            </Flex>
          </Stack>
          <Input
            name='client'
            label='Client Address'
            placeholder='0x'
            variant='outline'
            isRequired
            localForm={localForm}
          />
          <Input
            name='resolver'
            label='Resolver Address'
            placeholder='0x'
            variant='outline'
            isRequired
            localForm={localForm}
          />
          <Select
            name='token'
            label='Token'
            variant='outline'
            options={tokenOptions}
            localForm={localForm}
          />
          <NumberInput
            name='threshold'
            label='Threshold'
            min={1}
            max={ownersAndAllocations?.length || 1}
            step={1}
            variant='outline'
            localForm={localForm}
          />
          <Select
            name='arbitration'
            label='Arbitration'
            variant='outline'
            options={arbitrationOptions}
            localForm={localForm}
          />
          <Switch
            name='isDaoSplit'
            label='DAO Split?'
            localForm={localForm}
            defaultChecked={false}
          />
          <Input
            name='escrowDeadline'
            label='Escrow Deadline'
            defaultValue={
              Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60
            } // 30 days from now
            variant='outline'
            localForm={localForm}
          />
          <Flex justify='flex-end'>
            <Button type='submit' variant='outline' isDisabled={!writeAsync}>
              Submit
            </Button>
          </Flex>
        </Stack>
        <DevTool control={control} />
      </Box>
    </SiteLayout>
  );
};

export default EscrowZap;
