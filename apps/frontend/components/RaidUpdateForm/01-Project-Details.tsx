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
  Stack,
} from "@raidguild/design-system";
import { useRaidUpdate } from "@raidguild/dm-hooks";
import { IRaid } from "@raidguild/dm-types";
import { BUDGET_DISPLAY_OPTIONS, DELIVERY_PRIORITIES_DISPLAY_OPTIONS, RAID_CATEGORY_OPTIONS } from "@raidguild/dm-utils";
import { add } from "date-fns";
import _ from "lodash";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ProjectDetailsUpdateFormProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}
const ProjectDetailsUpdateForm: React.FC<ProjectDetailsUpdateFormProps> = ({
  raidId,
  closeModal,
  raid,
}: ProjectDetailsUpdateFormProps) => {
  const [sending, setSending] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    raid?.startDate ? new Date(raid?.startDate) : new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    raid?.endDate ? new Date(raid?.endDate) : add(new Date(), { weeks: 1 }),
  );
  const { data: session } = useSession();
  const token = _.get(session, "token");

  const { mutateAsync: updateRaidStatus } = useRaidUpdate({ token, raidId });

  const localform = useForm({
    mode: "all",
  });
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting }, // will add errors in once we add validation
  } = localform;

  async function onSubmit(values) {
    setSending(true);
    await updateRaidStatus({
      raid_updates: {
        name: values.raidName ?? raid.raidName,
        category_key: values.raidCategory.value ??
          raid.raidCategory.raidCategory,
        status_key: raid.status ?? raid.status,
        start_date: values.startDate ?? raid.startDate,
        end_date: values.endDate ?? raid.endDate,
      },
      consultation_update: {
        id: raid.consultationByConsultation.id,
        budget_key: values.raidBudget.value ??
          _.get(raid["consultation"], "budgetOption.budgetOption"),
      },
    });
    closeModal();
    setSending(false);
  }

  const selectedCategory = RAID_CATEGORY_OPTIONS.find(
    (v) => v.value === raid?.raidCategory.raidCategory,
  );

  const selectedBudget = BUDGET_DISPLAY_OPTIONS.find(
    (v) => v.value === _.get(raid["consultation"], "budgetOption.budgetOption"),
  );

  const selectedDeliveryPriority = DELIVERY_PRIORITIES_DISPLAY_OPTIONS.find(
    (v) =>
      v.value ===
        _.get(raid["consultation"], "deliveryPriority.deliveryPriority"),
  );

  const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} variant="outline">
      {value}
    </Button>
  ));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Input
          name="raidName"
          defaultValue={raid?.name ? raid?.name : ""}
          aria-label="Enter the Raid name"
          placeholder="Enter the Raid name"
          rounded="base"
          label="Raid Name"
          localForm={localform}
        />
        <Flex
          direction={{ base: "column", lg: "row" }}
          alignItems="center"
          justifyContent="space-between"
        >
          <DatePicker
            name="startDate"
            label="Raid Start Date (UTC)"
            selected={startDate}
            onChange={(date) => {
              if (Array.isArray(date)) {
                return;
              }
              setStartDate(date);
              setValue("startDate", date);
            }}
            customInput={<CustomCalInput />}
            localForm={localform}
          />
          <DatePicker
            name="endDate"
            label="Raid End Date (UTC)"
            selected={endDate}
            onChange={(date) => {
              if (Array.isArray(date)) {
                return;
              }
              setEndDate(date);
              setValue("endDate", date);
            }}
            customInput={<CustomCalInput />}
            localForm={localform}
          />
        </Flex>
        <FormControl>
          <FormLabel color="raid">Raid Budget</FormLabel>
          <Controller
            name="raidBudget"
            defaultValue={selectedBudget}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {
                  ...field
                }
                name="raidBudget"
                options={BUDGET_DISPLAY_OPTIONS}
                localForm={localform}
              />
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="raid">Raid Category</FormLabel>
          <Controller
            name="raidCategory"
            defaultValue={selectedCategory}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {
                  ...field
                }
                name="raidCategory"
                options={RAID_CATEGORY_OPTIONS}
                localForm={localform}
              />
            )}
          />
        </FormControl>
        <DatePicker
          name="desiredDeliveryDate"
          label="Desired Delivery Date"
          selected={_.get(
            raid["consultation"],
            "desired_delivery_date",
          ) ?? new Date()}
          onChange={(date) => {
            if (Array.isArray(date)) {
              return;
            }
            setStartDate(date);
            setValue("desiredDeliveryDate", date);
          }}
          customInput={<CustomCalInput />}
          localForm={localform}
        />

        <FormControl>
          <FormLabel color="raid">Delivery Priority</FormLabel>
          <Controller
            name="deliveryPriority"
            defaultValue={selectedDeliveryPriority}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {
                  ...field
                }
                name="deliveryPriority"
                options={DELIVERY_PRIORITIES_DISPLAY_OPTIONS}
                localForm={localform}
              />
            )}
          />
        </FormControl>
        {raid?.invoiceAddress !== null && (
          <Input
            name="invoiceAddress"
            isReadOnly
            defaultValue={raid?.invoiceAddress ? raid?.invoiceAddress : ""}
            aria-label="Enter the Invoice address"
            placeholder="Enter the Invoice address"
            rounded="base"
            label="Invoice Address"
            localForm={localform}
          />
        )}
      </Stack>

      <Button
        isLoading={isSubmitting || sending}
        type="submit"
        width="full"
        color="raid"
        borderColor="raid"
        border="1px solid"
        size="md"
        textTransform="uppercase"
        fontSize="sm"
        fontWeight="bold"
      >
        Update Project Details
      </Button>
    </form>
  );
};

export default ProjectDetailsUpdateForm;
