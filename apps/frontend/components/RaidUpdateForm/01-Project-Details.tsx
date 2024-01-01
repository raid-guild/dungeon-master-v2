/* eslint-disable dot-notation */
import {
  Button,
  DatePicker,
  Input,
  Select,
  Stack,
} from '@raidguild/design-system';
import { useRaidUpdate } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import {
  BUDGET_DISPLAY_OPTIONS,
  DELIVERY_PRIORITIES_DISPLAY_OPTIONS,
  RAID_CATEGORY_OPTIONS,
} from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProjectDetailsUpdateFormProps {
  closeModal?: () => void;
  raid: Partial<IRaid>;
}
const ProjectDetailsUpdateForm: React.FC<ProjectDetailsUpdateFormProps> = ({
  closeModal,
  raid,
}: ProjectDetailsUpdateFormProps) => {
  const [sending, setSending] = useState(false);

  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { mutateAsync: updateRaidStatus } = useRaidUpdate({
    token,
    raidId: raid.id,
    consultationId: raid.consultation.id,
  });

  const localForm = useForm({
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting }, // will add errors in once we add validation
  } = localForm;

  const startDate = watch('startDate')?.toLocaleDateString();
  const endDate = watch('endDate')?.toLocaleDateString();
  const desiredDeliveryDate = watch(
    'desiredDeliveryDate'
  )?.toLocaleDateString();

  const selectedCategory = RAID_CATEGORY_OPTIONS.find((option) =>
    raid?.raidCategory.raidCategory.includes(option.value)
  );

  const selectedBudget = BUDGET_DISPLAY_OPTIONS.filter((option) =>
    _.get(raid['consultation'], 'budgetOption.budgetOption').includes(
      option.value
    )
  );

  const selectedDeliveryPriority = DELIVERY_PRIORITIES_DISPLAY_OPTIONS.filter(
    (option) =>
      _.get(raid['consultation'], 'deliveryPriority.deliveryPriority').includes(
        option.value
      )
  );

  async function onSubmit(values) {
    setSending(true);
    await updateRaidStatus({
      raid_updates: {
        name: values.raidName ?? raid.raidName,
        category_key: values.raidCategory?.value ?? selectedCategory.value,
        status_key: values.status ?? raid.status,
        start_date: values.startDate ?? raid.startDate,
        end_date: values.endDate ?? raid.endDate,
      },
      consultation_updates: {
        desired_delivery_date:
          values.desiredDeliveryDate ?? raid.consultation.desiredDeliveryDate,
        budget_key: values?.raidBudget?.value || _.first(selectedBudget).value,
        delivery_priorities_key:
          values?.deliveryPriority?.value ??
          _.first(selectedDeliveryPriority).value,
      },
    });
    closeModal();
    setSending(false);
  }

  return (
    <Stack as='form' spacing={4} onSubmit={handleSubmit(onSubmit)}>
      <Input
        name='raidName'
        defaultValue={raid?.name ? raid?.name : ''}
        aria-label='Enter the Raid name'
        placeholder='Enter the Raid name'
        rounded='base'
        label='Raid Name'
        localForm={localForm}
      />

      <DatePicker
        name='startDate'
        label='Raid Start Date (UTC)'
        selected={startDate}
        localForm={localForm}
        tooltip='The date the raid is expected to Start or Started'
      />
      <DatePicker
        name='endDate'
        label='Raid End Date (UTC)'
        selected={endDate}
        localForm={localForm}
        tooltip='The date the raid is expected to End or Ended'
      />

      <Select
        name='raidBudget'
        label='Raid Budget'
        defaultValue={selectedBudget}
        options={BUDGET_DISPLAY_OPTIONS}
        localForm={localForm}
      />

      <Select
        name='raidCategory'
        label='Raid Category'
        defaultValue={selectedCategory}
        options={RAID_CATEGORY_OPTIONS}
        localForm={localForm}
      />

      <DatePicker
        name='desiredDeliveryDate'
        label='Desired Delivery Date'
        placeholderText='Select Date'
        selected={desiredDeliveryDate}
        localForm={localForm}
      />

      <Select
        defaultValue={selectedDeliveryPriority}
        name='deliveryPriority'
        label='Delivery Priority'
        options={DELIVERY_PRIORITIES_DISPLAY_OPTIONS}
        localForm={localForm}
      />

      <Button isLoading={isSubmitting || sending} type='submit'>
        Update Project Details
      </Button>
    </Stack>
  );
};

export default ProjectDetailsUpdateForm;
