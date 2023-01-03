import React, { useState } from 'react';
import _ from 'lodash';
import {
  Box,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
} from '@raidguild/design-system';
import { forwardRef } from '@chakra-ui/react';
import { add } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import { IRaid } from '../utils';
import { RAID_CATEGORY_OPTIONS } from '../utils/constants';
import useRaidUpdate from '../hooks/useRaidUpdate';
import { useSession } from 'next-auth/react';

interface RaidUpdateFormProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
}
const RaidUpdateForm: React.FC<RaidUpdateFormProps> = ({
  raidId,
  closeModal,
  raid,
}: RaidUpdateFormProps) => {
  const [sending, setSending] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { weeks: 1 }));
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { mutateAsync: updateRaidStatus } = useRaidUpdate({ token, raidId });

  const localForm = useForm({
    mode: 'all',
  });
  const {
    register,
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
        category_key: values.raidCategory ?? raid.raidCategory.raidCategory,
        status_key: raid.status ?? raid.status,
        start_date: values.startDate ?? raid.startDate,
        end_date: values.endDate ?? raid.endDate,
      },
    });
    closeModal();
    setSending(false);
  }

  const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} variant="outline">
      {value}
    </Button>
  ));

  return (
    <Box as="section">
      <Box
        bg="gray.800"
        shadow="lg"
        maxW={{ base: 'xl', md: '3xl' }}
        marginX="auto"
        paddingX={{ base: '6', md: '8' }}
        paddingY="6"
        rounded="lg"
      >
        <Box maxW="md" marginX="auto">
          <Box marginY="6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <Input
                  id="raidName"
                  defaultValue={raid?.name ? raid?.name : ''}
                  aria-label="Enter the Raid name"
                  placeholder="Enter the Raid name"
                  rounded="base"
                  label="Raid Name"
                  localForm={localForm}
                  {...register('raidName')}
                />
                <FormControl>
                  <FormLabel color="raid">Raid Category</FormLabel>
                  <Controller
                    name="raidCategory"
                    defaultValue={
                      raid?.raidCategory.raidCategory
                        ? raid?.raidCategory.raidCategory
                        : ''
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        name="raidCategory"
                        options={RAID_CATEGORY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
                <Flex
                  direction={{ base: 'column', lg: 'row' }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormControl>
                    <FormLabel color="raid">Raid Start Date (UTC)</FormLabel>
                    <DatePicker
                      isRequired
                      {...register('startDate', { valueAsDate: true })}
                      defaultValue={raid.startDate ? raid.startDate : startDate}
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setValue('startDate', date);
                      }}
                      customInput={<CustomCalInput />}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="raid">Raid End Date (UTC)</FormLabel>
                    <DatePicker
                      isRequired
                      {...register('endDate', { valueAsDate: true })}
                      defaultValue={raid?.endDate ? raid?.endDate : endDate}
                      selected={endDate}
                      onChange={(date) => {
                        setEndDate(date);
                        setValue('endDate', date);
                      }}
                      customInput={<CustomCalInput />}
                    />
                  </FormControl>
                </Flex>
                {raid?.invoiceAddress !== null && (
                  <Input
                    id="invoiceAddress"
                    isReadOnly
                    defaultValue={
                      raid?.invoiceAddress ? raid?.invoiceAddress : ''
                    }
                    aria-label="Enter the Invoice address"
                    placeholder="Enter the Invoice address"
                    rounded="base"
                    label="Invoice Address"
                    localForm={localForm}
                    {...register('invoiceAddress')}
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
