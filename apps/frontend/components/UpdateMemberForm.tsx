import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  useToast,
  FormControl,
  FormLabel,
  forwardRef,
  Select as ChakraSelect,
} from '@chakra-ui/react';
import { add } from 'date-fns';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { updateRecord, IMember } from 'utils';
import { useRouter } from 'next/router';
import { HiOutlineLink } from 'react-icons/hi';
import Input from '@/components/Input';
import { GUILD_CLASS, SKILLS } from '../utils/constants';

interface UpdateMemberFormProps {
  id?: string;
  onClose?: () => void;
  member: IMember;
}
const UpdateMemberForm: React.FC<UpdateMemberFormProps> = ({
  id,
  onClose,
  member,
}: UpdateMemberFormProps) => {
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

    const result = await updateRecord('member', id, {
      name: values.memberName,
      guild_class: values.guildClass,
      ens_name: values.ensName,
      //   invoice_address: values.invoiceAddress,
      //   start_date: values.startDate,
      //   end_date: values.endDate,
      //   category: values.raidCategory,
    });
    if (result) {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated.',
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
                  defaultValue={member?.name ? member?.name : ''}
                  aria-label="Enter your name"
                  placeholder="What is your name?"
                  rounded="base"
                  label="Member Name"
                  localForm={localForm}
                  {...register('memberName')}
                />
                <Input
                  id="ensName"
                  defaultValue={member?.ensName ? member?.ensName : null}
                  aria-label="Enter your ENS name"
                  placeholder="What is your ENS name?"
                  rounded="base"
                  label="ENS Name"
                  localForm={localForm}
                  {...register('ensName')}
                />
                <FormControl>
                  <FormLabel color="raid">Guild Class</FormLabel>
                  <Controller
                    name="guildClass"
                    defaultValue={member?.guildClass ? member?.guildClass : ''}
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect {...field}>
                        {GUILD_CLASS.map((guildClass) => (
                          <option value={guildClass}>{guildClass}</option>
                        ))}
                      </ChakraSelect>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="raid">Primary Skills</FormLabel>
                  <Controller
                    name="primarySkills"
                    defaultValue={
                      member?.primarySkills ? member?.primarySkills : ''
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={SKILLS.map((skill) => ({
                          value: skill,
                          label: skill,
                        }))}
                      />
                    )}
                  />
                </FormControl>
                {/*

                <Flex
                  direction={{ base: 'column', lg: 'row' }}
                  alignItems='center'
                  justifyContent='center'
                >
                  <FormControl>
                    <FormLabel color='raid'>Raid Start Date (UTC)</FormLabel>
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
                    <FormLabel color='raid'>Raid End Date (UTC)</FormLabel>
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
                  id='invoiceAddress'
                  defaultValue={
                    raid?.invoiceAddress ? raid?.invoiceAddress : ''
                  }
                  aria-label='Enter the Invoice address'
                  placeholder='Enter the Invoice address'
                  rounded='base'
                  label='Invoice Address'
                  localForm={localForm}
                  {...register('invoiceAddress')}
                />
                */}
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
                  Update Profile
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateMemberForm;
