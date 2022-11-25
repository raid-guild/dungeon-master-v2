import React, { useState } from 'react';
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
import { add } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { updateRecord, IRaid } from '../utils';
import { useRouter } from 'next/router';
import { RAID_CATEGORY } from '../utils/constants';

interface UpdateRaidFormProps {
  id?: string;
  onClose?: () => void;
  raid: IRaid;
}
const UpdateRaidForm: React.FC<UpdateRaidFormProps> = ({
  id,
  onClose,
  raid,
}: UpdateRaidFormProps) => {
  const [sending, setSending] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { weeks: 1 }));
  const toast = useToast();
  const router = useRouter();

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

  async function onSubmit(values) {
    setSending(true);

    const result = await updateRecord('raid', id, {
      raid_name: values.raidName,
      invoice_address: values.invoiceAddress,
      start_date: values.startDate,
      end_date: values.endDate,
      category: values.raidCategory,
    });
    if (result) {
      toast({
        title: 'Raid Updated',
        description: 'Your updates have been made.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSending(false);
      onClose();
      router.replace(router.asPath);
    }
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
                  defaultValue={raid?.raidName ? raid?.raidName : ''}
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
                      <Select {...field}>
                        {RAID_CATEGORY.map((category) => (
                          <option value={category}>{category}</option>
                        ))}
                      </Select>
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
                <Input
                  id="invoiceAddress"
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

export default UpdateRaidForm;
