import {
  Box,
  Button,
  DatePicker,
  Flex,
  FormControl,
  FormLabel,
  forwardRef,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
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
  "Project Details",
  "Key Links",
  "Client PoC",
  "Additional Info",
  "Portfolio",
];

interface RaidUpdateFormProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}
const RaidUpdateForm = ({ raidId, closeModal, raid }: RaidUpdateFormProps) => {
  const [sending, setSending] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    raid?.startDate ? new Date(raid?.startDate) : new Date(),
    raid?.startDate ? new Date(raid?.startDate) : new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    raid?.endDate ? new Date(raid?.endDate) : add(new Date(), { weeks: 1 }),
    raid?.endDate ? new Date(raid?.endDate) : add(new Date(), { weeks: 1 }),
  );
  const { data: session } = useSession();
  const token = _.get(session, "token");

  const token = _.get(session, "token");

  const { mutateAsync: updateRaidStatus } = useRaidUpdate({ token, raidId });

  const localForm = useForm({
    mode: "all",
    mode: "all",
  });
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting }, // will add errors in once we add validation
  } = localForm;

  async function onSubmit(values) {
    setSending(true);
    await updateRaidStatus({
      raid_updates: {
        name: values.raidName ?? raid.raidName,
        category_key: values.raidCategory.value ??
          raid.raidCategory.raidCategory,
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
        budget_key: values.raidBudget.value ??
          _.get(raid["consultation"], "budgetOption.budgetOption"),
      },
    });
    closeModal();
    setSending(false);
  }

  const selectedCategory = RAID_CATEGORY_OPTIONS.find(
    (v) => v.value === raid?.raidCategory.raidCategory,
    (v) => v.value === raid?.raidCategory.raidCategory,
  );

  const selectedBudget = BUDGET_DISPLAY_OPTIONS.find(
    (v) => v.value === _.get(raid["consultation"], "budgetOption.budgetOption"),
    (v) => v.value === _.get(raid["consultation"], "budgetOption.budgetOption"),
  );

  const selectedDeliveryPriority = DELIVERY_PRIORITIES_DISPLAY_OPTIONS.find(
    (v) =>
      v.value ===
        _.get(raid["consultation"], "deliveryPriority.deliveryPriority"),
  );

  const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} variant="outline">
    <Button onClick={onClick} ref={ref} variant="outline">
      {value}
    </Button>
  ));

  return (
    <Box as="section">
      <Tabs variant={"enclosed-colored"} colorScheme="primary.500">
    <Box as="section">
      <Tabs variant={"enclosed-colored"} colorScheme="primary.500">
        <TabList>
          {raid_tabs.map((tab) => <Tab key={tab}>{tab}</Tab>)}
        </TabList>

        <Box
          bg="gray.800"
          maxW={{ base: "xl", md: "3xl" }}
          marginX="auto"
          paddingX={{ base: "6", md: "8" }}
          paddingY="6"
          rounded="lg"
        >
          <Box maxW="md" marginX="auto">
            <Box marginY="6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <TabPanels>
                  <TabPanel>
                    <Stack spacing={4}>
                      <Input
                        name="raidName"
                        defaultValue={raid?.name ? raid?.name : ""}
                        aria-label="Enter the Raid name"
                        placeholder="Enter the Raid name"
                        rounded="base"
                        label="Raid Name"
                        localForm={localForm}
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
                          localForm={localForm}
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
                          localForm={localForm}
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
                              {
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                ...field
                              }
                              name="raidBudget"
                              options={BUDGET_DISPLAY_OPTIONS}
                              localForm={localForm}
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
                              {
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                ...field
                              }
                              name="raidCategory"
                              options={RAID_CATEGORY_OPTIONS}
                              localForm={localForm}
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
                        localForm={localForm}
                      />

                      <FormControl>
                        <FormLabel color="raid">Delivery Priority</FormLabel>
                        <Controller
                          name="deliveryPriority"
                          defaultValue={selectedDeliveryPriority}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                ...field
                              }
                              name="deliveryPriority"
                              options={DELIVERY_PRIORITIES_DISPLAY_OPTIONS}
                              localForm={localForm}
                            />
                          )}
                        />
                      </FormControl>
                      {raid?.invoiceAddress !== null && (
                        <Input
                          name="invoiceAddress"
                          isReadOnly
                          defaultValue={raid?.invoiceAddress
                            ? raid?.invoiceAddress
                            : ""}
                          aria-label="Enter the Invoice address"
                          placeholder="Enter the Invoice address"
                          rounded="base"
                          label="Invoice Address"
                          localForm={localForm}
                        />
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Text>Key Links</Text>
                  </TabPanel>

                  <TabPanel>
                    <Text>Client PoC</Text>
                  </TabPanel>

                  <TabPanel>
                    <Text>Additional Info</Text>
                  </TabPanel>

                  <TabPanel>
                    <Text>Portfolio</Text>
                  </TabPanel>
                </TabPanels>
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
                  Update Raid
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      </Tabs>
    </Box>
  );
};

export default RaidUpdateForm;
