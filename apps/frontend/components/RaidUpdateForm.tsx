import {
  Box,
  Button,
  DatePicker,
  DatePicker,
  Flex,
  Flex,
  FormControl,
  FormLabel,
  forwardRef,
  forwardRef,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@raidguild/design-system";
import {
  BUDGET_DISPLAY_OPTIONS,
  IConsultation,
  IConsultationUpdate,
  IRaid,
  RAID_CATEGORY_OPTIONS,
} from "@raidguild/dm-utils";
import { useRaidUpdate } from "@raidguild/dm-hooks";
import { IRaid } from "@raidguild/dm-types";
import { RAID_CATEGORY_OPTIONS } from "@raidguild/dm-utils";
import { add } from "date-fns";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { add } from "date-fns";
import { Controller, useForm } from "react-hook-form";

const raid_tabs = [
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
}
const RaidUpdateForm = ({ raidId, closeModal, raid }: RaidUpdateFormProps) => {
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

  const localForm = useForm({
    mode: "all",
  });
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting }, // will add errors in once we add validation
  } = localForm;

  console.log("raid", raid);
  // console.log(raid.consultationByConsultation.budgetOption.budgetOption)

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
        budget_key: values.raidBudget.value,
      },
    });
    closeModal();
    setSending(false);
  }

  const selectedCategory = RAID_CATEGORY_OPTIONS.find(
    (v) => v.value === raid?.raidCategory.raidCategory,
  );

  const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} variant="outline">
      {value}
    </Button>
  ));

  return (
    <Box as="section">
      <Tabs variant={"enclosed-colored"} colorScheme="primary.500">
        <TabList>
          {raid_tabs.map((tab) => <Tab>{tab}</Tab>)}
        </TabList>
      </Tabs>

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
                <FormControl>
                  <FormLabel color="raid">Raid Category</FormLabel>
                  <Controller
                    name="raidCategory"
                    defaultValue={selectedCategory}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {// eslint-disable-next-line react/jsx-props-no-spreading
                        ...field}
                        name="raidCategory"
                        options={RAID_CATEGORY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>

                {/* Raid Budget Select */}
                {
                  /* <FormControl>
                  <FormLabel color='raid'>Raid Budget</FormLabel>
                  <Controller
                    name='raidBudget'
                    defaultValue={selectedCategory}
                    control={control}
                    render={({ field }) => (
                      <Select
                      isMulti
                      defaultValue={BUDGET_DISPLAY_OPTIONS.filter((budget) => budget.value === raid.consultationByConsultation.budgetOption.budgetOption)}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...field}
                        name='raidBudget'
                        options={BUDGET_DISPLAY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl> */
                }
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
                  Update Raid
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RaidUpdateForm;
