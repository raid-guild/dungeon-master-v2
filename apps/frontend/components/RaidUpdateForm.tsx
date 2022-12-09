import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Box,
  Button,
  Stack,
  useToast,
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
import { useRouter } from 'next/router';
import { RAID_CATEGORY } from '../utils/constants';
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
  const toast = useToast();
  const router = useRouter();
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
    formState: { errors, isSubmitting },
  } = localForm;

  const raidCategoryMapped = RAID_CATEGORY.map((category) => ({
    label: category,
    value: category,
  }));

  console.log('raid', raid);
  async function onSubmit(values) {
    setSending(true);
    console.log('form values', values);
    const raidWithoutUpdateValues = _.omit(
      raid,
      'status',
      'name',
      'category',
      'startDate',
      'endDate'
    );
    const result = await updateRaidStatus({
      name: values.raidName ?? raid.name,
      category: values.raidCategory,
      status: raid.status ?? raid.status,
      start_date: values.startDate ?? raid.startDate,
      end_date: values.endDate ?? raid.endDate,
      ...raidWithoutUpdateValues,
    });
    closeModal();
    setSending(false);

    console.log('result', result);

    //   const result = await updateRecord('raid', id, {
    //     raid_name: values.raidName,
    //     invoice_address: values.invoiceAddress,
    //     start_date: values.startDate,
    //     end_date: values.endDate,
    //     category: values.raidCategory,
    //   });
    //   if (result) {
    //     toast({
    //       title: 'Raid Updated',
    //       description: 'Your updates have been made.',
    //       status: 'success',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     setSending(false);
    //     onClose();
    //     router.replace(router.asPath);
    //   }
    // setSending(false);
  }

  const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} variant="outline">
      {value}
    </Button>
  ));

  useEffect(() => {
    setValue('raidName', raid?.name);
    setValue('raidCategory', raid?.category);
  }, [raid]);

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
                    defaultValue={raid?.category ? raid?.category : ''}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        name="raidCategory"
                        options={raidCategoryMapped}
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
