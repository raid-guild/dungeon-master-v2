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
  import {
    BUDGET_DISPLAY_OPTIONS,
    DELIVERY_PRIORITIES_DISPLAY_OPTIONS,
    IRaid,
    RAID_CATEGORY_OPTIONS,
  } from "@raidguild/dm-utils";
  import { add } from "date-fns";
  import _ from "lodash";
  import { useSession } from "next-auth/react";
  import React, { useState } from "react";
  import { Controller, useForm } from "react-hook-form";
  
  const raid_tabs = [
    "Project Details",
    "Key Links",
    "Client PoC",
    "Additional Info",
    "Portfolio",
  ];
  
  interface KeyLinksUpdateFormProps {
    raidId?: string;
    closeModal?: () => void;
    raid: Partial<IRaid>;
    // consultation:  Partial<IConsultation>;
  }
  const KeyLinksUpdateForm: React.FC<KeyLinksUpdateFormProps> = ({
    raidId,
    closeModal,
    raid,
  }: KeyLinksUpdateFormProps) => {
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
  
    const form_projectDetails = useForm({
      mode: "all",
    });
    const {
      handleSubmit,
      setValue,
      control,
      formState: { isSubmitting }, // will add errors in once we add validation
    } = form_projectDetails;
  
    async function onSubmit(values) {
      setSending(true);
    //   await updateRaidStatus({
    //     raid_updates: {
    //       name: values.raidName ?? raid.raidName,
    //       category_key: values.raidCategory.value ??
    //         raid.raidCategory.raidCategory,
    //       status_key: raid.status ?? raid.status,
    //       start_date: values.startDate ?? raid.startDate,
    //       end_date: values.endDate ?? raid.endDate,
    //     },
    //     consultation_update: {
    //       id: raid.consultationByConsultation.id,
    //       budget_key: values.raidBudget.value ??
    //         _.get(raid["consultation"], "budgetOption.budgetOption"),
    //     },
    //   });
      closeModal();
      setSending(false);
    }
  
    
  
    const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
      <Button onClick={onClick} ref={ref} variant="outline">
        {value}
      </Button>
    ));
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
        <Input
                        name="projectSpecs"
                        defaultValue={_.get(raid["consultation"], "link")}
                        aria-label="Project Specs"
                        placeholder="Link to Project Specs Dcoument"
                        rounded="base"
                        label="Project Specs"
                        localForm={form_projectDetails}
                      /> 
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
          Update Key Links
        </Button>
      </form>
    );
  };
  
  export default KeyLinksUpdateForm;
  