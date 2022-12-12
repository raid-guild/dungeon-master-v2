import React, { useState } from 'react';
import _ from 'lodash';
import {
  Box,
  Button,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Select,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import useMemberUpdate from '../hooks/useMemberUpdate';
import { useForm, Controller } from 'react-hook-form';
import { IMember } from '../utils';
import { HiOutlineLink } from 'react-icons/hi';
import { GUILD_CLASS } from '../utils/constants';

interface UpdateMemberFormProps {
  memberId?: string;
  closeModal?: () => void;
  member: IMember;
}
const UpdateMemberForm: React.FC<UpdateMemberFormProps> = ({
  memberId,
  member,
  closeModal,
}: UpdateMemberFormProps) => {
  const [sending, setSending] = useState(false);
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { mutateAsync: updateMemberStatus } = useMemberUpdate({
    token,
    memberId,
  });

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

  const guildClassMapped = GUILD_CLASS.map((guildClass) => ({
    label: guildClass,
    value: guildClass,
  }));

  async function onSubmit(values) {
    setSending(true);
    console.log('form values', values);
    // const raidWithoutUpdateValues = _.omit(
    //   raid,
    //   'status',
    //   'name',
    //   'category',
    //   'startDate',
    //   'endDate'
    // );
    await updateMemberStatus({
      name: values.memberName ?? member.name,
      // category: values.raidCategory,
      // status: raid.status ?? raid.status,
      // start_date: values.startDate ?? raid.startDate,
      // end_date: values.endDate ?? raid.endDate,
      // ...raidWithoutUpdateValues,
    });
    closeModal();
    setSending(false);
  }

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
                      <Select
                        {...field}
                        options={guildClassMapped}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
                {/* <FormControl>
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
                </FormControl> */}
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
