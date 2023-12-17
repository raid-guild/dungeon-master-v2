/* eslint-disable dot-notation */
import {
  Button,
  DatePicker,
  Flex,
  FormControl,
  FormLabel,
  forwardRef,
  Input,
  Select,
  Stack
} from '@raidguild/design-system';
import { useRaidUpdate } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import {
  BUDGET_DISPLAY_OPTIONS,
  DELIVERY_PRIORITIES_DISPLAY_OPTIONS,
  RAID_CATEGORY_OPTIONS
} from '@raidguild/dm-utils';
import Inspect from 'inspx';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ProjectDetailsUpdateFormProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}
const ProjectDetailsUpdateForm: React.FC<ProjectDetailsUpdateFormProps> = ({
  closeModal,
  raid
}: ProjectDetailsUpdateFormProps) => {
  const [sending, setSending] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(
    raid?.startDate ? new Date(raid?.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    raid?.endDate ? new Date(raid?.endDate) : null
  );

  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState<Date | null>(
    new Date(raid['consultation']['desiredDeliveryDate'] ?? null)
  );
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { mutateAsync: updateRaidStatus } = useRaidUpdate({
    token,
    raidId: raid.id,
    consultationId: raid.consultation.id
  });

  const localForm = useForm({
    mode: 'all'
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting } // will add errors in once we add validation
  } = localForm;

  async function onSubmit(values) {
    setSending(true);
    await updateRaidStatus({
      raid_updates: {
        name: values.raidName ?? raid.raidName,
        category_key:
          values.raidCategory.value ?? raid.raidCategory.raidCategory,
        status_key: values.status ?? raid.status,
        start_date: values.startDate ?? startDate,
        end_date: values.endDate ?? endDate
      },
      consultation_updates: {
        desired_delivery_date:
          values.desiredDeliveryDate ??
          raid['consultation']['desiredDeliveryDate'],
        budget_key:
          values.raidBudget.value ??
          raid['consultation'].budgetOption.budgetOption,
        delivery_priorities_key:
          values.deliveryPriority.value ?? raid['consultation'].deliveryPriority
      }
    });
    closeModal();
    setSending(false);
  }

  const selectedCategory = RAID_CATEGORY_OPTIONS.find(
    (v) => v.value === raid?.raidCategory.raidCategory
  );

  const selectedBudget = BUDGET_DISPLAY_OPTIONS.find(
    (v) => v.value === _.get(raid['consultation'], 'budgetOption.budgetOption')
  );

  const selectedDeliveryPriority = DELIVERY_PRIORITIES_DISPLAY_OPTIONS.find(
    (v) =>
      v.value ===
      _.get(raid['consultation'], 'deliveryPriority.deliveryPriority')
  );

  const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} variant='outline'>
      {value}
    </Button>
  ));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Input
          name='raidName'
          defaultValue={raid?.name ? raid?.name : ''}
          aria-label='Enter the Raid name'
          placeholder='Enter the Raid name'
          rounded='base'
          label='Raid Name'
          localForm={localForm}
        />
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          alignItems='center'
          justifyContent='space-between'
        >
          <DatePicker
            name='startDate'
            label='Raid Start Date (UTC)'
            selected={startDate}
            onChange={(date) => {
              if (Array.isArray(date)) {
                return;
              }
              setStartDate(date);
              setValue('startDate', date);
            }}
            customInput={<CustomCalInput />}
            localForm={localForm}
          />
          <DatePicker
            name='endDate'
            label='Raid End Date (UTC)'
            selected={endDate}
            onChange={(date) => {
              if (Array.isArray(date)) {
                return;
              }
              setEndDate(date);
              setValue('endDate', date);
            }}
            customInput={<CustomCalInput />}
            localForm={localForm}
          />
        </Flex>
        <FormControl>
          <FormLabel color='raid'>Raid Budget</FormLabel>
          <Controller
            name='raidBudget'
            defaultValue={selectedBudget}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...field}
                name='raidBudget'
                options={BUDGET_DISPLAY_OPTIONS}
                localForm={localForm}
              />
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel color='raid'>Raid Category</FormLabel>
          <Controller
            name='raidCategory'
            defaultValue={selectedCategory}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...field}
                name='raidCategory'
                options={RAID_CATEGORY_OPTIONS}
                localForm={localForm}
              />
            )}
          />
        </FormControl>
        <DatePicker
          name='desiredDeliveryDate'
          label='Desired Delivery Date'
          selected={desiredDeliveryDate}
          onChange={(date) => {
            if (Array.isArray(date)) {
              return;
            }
            setDesiredDeliveryDate(date);
            setValue('desiredDeliveryDate', date);
          }}
          customInput={<CustomCalInput />}
          localForm={localForm}
        />

        
          <FormControl>
            <FormLabel color='raid'>Delivery Priority</FormLabel>
            <Controller
              name='deliveryPriority'
              defaultValue={selectedDeliveryPriority}
              control={control}
              render={({ field }) => (
                <Select
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...field}
                  name='deliveryPriority'
                  options={DELIVERY_PRIORITIES_DISPLAY_OPTIONS}
                  localForm={localForm}
                />
              )}
            />
          </FormControl>
        
      </Stack>

      <Button
        isLoading={isSubmitting || sending}
        type='submit'
        width='full'
        color='raid'
        borderColor='raid'
        border='1px solid'
        size='md'
        textTransform='uppercase'
        fontSize='sm'
        bgColor='primary.500'
        fontWeight='bold'
      >
        Update Project Details
      </Button>
    </form>
  );
};

export default ProjectDetailsUpdateForm;
