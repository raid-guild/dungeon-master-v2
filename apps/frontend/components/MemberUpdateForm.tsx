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
import { IMember, IApplication } from '../utils';
import {
  GUILD_CLASS_OPTIONS,
  SKILLS_DISPLAY_OPTIONS,
} from '../utils/constants';

interface UpdateMemberFormProps {
  memberId?: string;
  closeModal?: () => void;
  member: IMember;
  application?: IApplication;
}
const UpdateMemberForm: React.FC<UpdateMemberFormProps> = ({
  memberId,
  member,
  application,
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
    control,
    formState: { errors, isSubmitting },
  } = localForm;

  async function onSubmit(values) {
    setSending(true);

    await updateMemberStatus({
      member_updates: {
        name: values.memberName ?? member.name,
        primary_class_key: values.guildClass ?? member.guildClass.guildClass,
      },
      contact_info_id: member.contactInfo.id,
      contact_info_updates: {
        email: values.emailAddress ?? member.contactInfo.email,
        discord: values.discordHandle ?? member.contactInfo.discord,
        github: values.githubHandle ?? member.contactInfo.github,
        twitter: values.twitterHandle ?? member.contactInfo.twitter,
        telegram: values.telegramHandle ?? member.contactInfo.telegram,
      },
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
                  id="memberName"
                  defaultValue={member?.name ? member?.name : ''}
                  aria-label="Enter your name"
                  placeholder="What is your name?"
                  rounded="base"
                  label="Member Name"
                  localForm={localForm}
                  {...register('memberName')}
                />
                <Input
                  id="emailAddress"
                  defaultValue={
                    member?.contactInfo.email ? member?.contactInfo.email : null
                  }
                  aria-label="Enter your email address"
                  placeholder="What is your email address?"
                  rounded="base"
                  label="Email Address"
                  localForm={localForm}
                  {...register('emailAddress')}
                />
                <Input
                  id="githubHandle"
                  defaultValue={
                    member?.contactInfo.github
                      ? member?.contactInfo.github
                      : null
                  }
                  aria-label="Enter your GitHub handle"
                  placeholder="What is your GitHub handle?"
                  rounded="base"
                  label="GitHub Handle"
                  localForm={localForm}
                  {...register('githubHandle')}
                />
                <Input
                  id="discordHandle"
                  defaultValue={
                    member?.contactInfo.discord
                      ? member?.contactInfo.discord
                      : null
                  }
                  aria-label="Enter your Discord handle"
                  placeholder="What is your Discord handle?"
                  rounded="base"
                  label="Discord Handle"
                  localForm={localForm}
                  {...register('discordHandle')}
                />
                <Input
                  id="telegramHandle"
                  defaultValue={
                    member?.contactInfo.telegram
                      ? member?.contactInfo.telegram
                      : null
                  }
                  aria-label="Enter your Telegram handle"
                  placeholder="What is your Telegram handle?"
                  rounded="base"
                  label="Telegram Handle"
                  localForm={localForm}
                  {...register('telegramHandle')}
                />
                <Input
                  id="twitterHandle"
                  defaultValue={
                    member?.contactInfo.twitter
                      ? member?.contactInfo.twitter
                      : null
                  }
                  aria-label="Enter your Twitter handle"
                  placeholder="What is your Twitter handle?"
                  rounded="base"
                  label="Twitter Handle"
                  localForm={localForm}
                  {...register('twitterHandle')}
                />
                <FormControl>
                  <FormLabel color="raid">Guild Class</FormLabel>
                  <Controller
                    name="guildClass"
                    defaultValue={
                      member?.guildClass.guildClass
                        ? member?.guildClass.guildClass
                        : ''
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={GUILD_CLASS_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="raid">Primary Skills</FormLabel>
                  <Controller
                    name="primarySkills"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isDisabled
                        {...field}
                        options={SKILLS_DISPLAY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="raid">Secondary Skills</FormLabel>
                  <Controller
                    name="secondarySkil"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isDisabled
                        {...field}
                        options={SKILLS_DISPLAY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
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
