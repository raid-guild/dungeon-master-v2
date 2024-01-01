/* eslint-disable dot-notation */
import { Box, Button, Input, Select, Stack } from '@raidguild/design-system';
import { useMemberUpdate } from '@raidguild/dm-hooks';
import { IApplication, IMember } from '@raidguild/dm-types';
import {
  GUILD_CLASS_OPTIONS,
  IS_RAIDING_OPTIONS,
  SKILLS_DISPLAY_OPTIONS,
} from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UpdateMemberFormProps {
  memberId?: string;
  memberAddress?: string;
  closeModal?: () => void;
  member: IMember;
  application?: IApplication;
}
const UpdateMemberForm = ({
  memberId,
  memberAddress,
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
    memberAddress,
  });

  const localForm = useForm({
    mode: 'all',
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = localForm;

  const primarySkills = _.chain(member['membersSkills'])
    .filter({ skillType: { skillType: 'PRIMARY' } })
    .map('skill.skill')
    .value();

  const secondarySkills = _.chain(member['membersSkills'])
    .filter({ skillType: { skillType: 'SECONDARY' } })
    .map('skill.skill')
    .value();

  async function onSubmit(values) {
    setSending(true);

    const newPrimarySkills = _.flatMap(values.primarySkills, (skill) => ({
      skill_key: skill.value,
      skill_type_key: 'PRIMARY',
      member_id: memberId,
    }));

    const newSecondarySkills = _.flatMap(values.secondarySkills, (skill) => ({
      skill_key: skill.value,
      skill_type_key: 'SECONDARY',
      member_id: memberId,
    }));

    const existingPrimarySkills = _.flatMap(primarySkills, (skill) => ({
      skill_key: skill,
      skill_type_key: 'PRIMARY',
      member_id: memberId,
    }));

    const existingSecondarySkills = _.flatMap(secondarySkills, (skill) => ({
      skill_key: skill,
      skill_type_key: 'SECONDARY',
      member_id: memberId,
    }));

    const updatePrimarySkills =
      newPrimarySkills.length > 0 ? newPrimarySkills : existingPrimarySkills;
    const updateSecondarySkills =
      newSecondarySkills.length > 0
        ? newSecondarySkills
        : existingSecondarySkills;

    await updateMemberStatus({
      member_updates: {
        name: values.memberName ?? member.name,
        primary_class_key:
          values.guildClass?.value ?? member.guildClass.guildClass,
        is_raiding: values?.isRaiding?.value ?? member?.isRaiding,
      },
      skills_updates: [...updatePrimarySkills, ...updateSecondarySkills],
      contact_info_id: member.contactInfo.id,
      contact_info_updates: {
        email: values.emailAddress ?? member?.contactInfo?.email,
        discord: values.discordHandle ?? member?.contactInfo?.discord,
        github: values.githubHandle ?? member?.contactInfo?.github,
        twitter: values.twitterHandle ?? member?.contactInfo?.twitter,
        telegram: values.telegramHandle ?? member?.contactInfo?.telegram,
      },
    });
    closeModal();
    setSending(false);
  }

  return (
    <Box as='section'>
      <Box
        maxW={{ base: 'xl', md: '3xl' }}
        marginX='auto'
        paddingX={{ base: '6', md: '8' }}
        paddingY='6'
        rounded='lg'
      >
        <Box maxW='md' marginX='auto'>
          <Box marginY='6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <Input
                  name='memberName'
                  defaultValue={member?.name ? member.name : ''}
                  aria-label='Enter your name'
                  placeholder='What is your name?'
                  label='Member Name'
                  localForm={localForm}
                />
                <Input
                  name='emailAddress'
                  defaultValue={
                    member?.contactInfo?.email
                      ? member?.contactInfo.email
                      : null
                  }
                  aria-label='Enter your email address'
                  placeholder='What is your email address?'
                  label='Email Address'
                  localForm={localForm}
                />
                <Input
                  name='githubHandle'
                  defaultValue={
                    member?.contactInfo?.github
                      ? member?.contactInfo.github
                      : null
                  }
                  aria-label='Enter your GitHub handle'
                  placeholder='What is your GitHub handle?'
                  label='GitHub Handle'
                  localForm={localForm}
                />
                <Input
                  name='discordHandle'
                  defaultValue={
                    member?.contactInfo?.discord
                      ? member?.contactInfo.discord
                      : null
                  }
                  aria-label='Enter your Discord handle'
                  placeholder='What is your Discord handle?'
                  label='Discord Handle'
                  localForm={localForm}
                />
                <Input
                  name='telegramHandle'
                  defaultValue={
                    member?.contactInfo?.telegram
                      ? member?.contactInfo.telegram
                      : null
                  }
                  aria-label='Enter your Telegram handle'
                  placeholder='What is your Telegram handle?'
                  label='Telegram Handle'
                  localForm={localForm}
                />
                <Input
                  name='twitterHandle'
                  defaultValue={
                    member?.contactInfo?.twitter
                      ? member?.contactInfo.twitter
                      : null
                  }
                  aria-label='Enter your Twitter handle'
                  placeholder='What is your Twitter handle?'
                  label='Twitter Handle'
                  localForm={localForm}
                />

                <Select
                  name='guildClass'
                  label='Guild Class'
                  options={GUILD_CLASS_OPTIONS}
                  defaultValue={
                    GUILD_CLASS_OPTIONS.find(
                      (option) =>
                        option.value === member?.guildClass?.guildClass
                    ) ?? null
                  }
                  localForm={localForm}
                />

                <Select
                  name='primarySkills'
                  label='Primary Skills'
                  isMulti
                  defaultValue={SKILLS_DISPLAY_OPTIONS.filter((option) =>
                    primarySkills.includes(option.value)
                  )}
                  options={SKILLS_DISPLAY_OPTIONS}
                  localForm={localForm}
                />

                <Select
                  isMulti
                  name='secondarySkills'
                  label='Secondary Skills'
                  defaultValue={SKILLS_DISPLAY_OPTIONS.filter((option) =>
                    secondarySkills.includes(option.value)
                  )}
                  options={SKILLS_DISPLAY_OPTIONS}
                  localForm={localForm}
                />

                <Select
                  name='isRaiding'
                  label='Raiding?'
                  defaultValue={
                    (IS_RAIDING_OPTIONS.find(
                      (option) => option.value === member?.isRaiding
                    ) || { value: false, label: 'Not Raiding' }) as any
                  }
                  options={IS_RAIDING_OPTIONS as any[]} // Option[]}
                  localForm={localForm}
                />

                <Button
                  isLoading={isSubmitting || sending}
                  type='submit'
                  width='full'
                  color='raid'
                  borderColor='raid'
                  border='1px solid'
                  size='md'
                  textTransform='uppercase'
                  fontSize='sm'
                  fontWeight='bold'
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
