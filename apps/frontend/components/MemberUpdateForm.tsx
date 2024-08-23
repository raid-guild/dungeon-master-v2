/* eslint-disable dot-notation */
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Textarea,
} from '@raidguild/design-system';
import { useMemberDetail, useMemberUpdate } from '@raidguild/dm-hooks';
import { IMember } from '@raidguild/dm-types';
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
  member: IMember;
  introduction?: string;
  memberAddress?: string;
  memberId?: string;
  closeModal?: () => void;
}
const UpdateMemberForm = ({
  member,
  introduction,
  memberAddress,
  memberId,
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

  const { refetch } = useMemberDetail({ memberAddress, token });

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

  const guildClasses = _.map(member['membersGuildClasses'], 'guildClassKey');

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

    const newGuildClasses = _.map(values.guildClasses, (guildClass) => ({
      member_id: memberId,
      guild_class_key: guildClass.value,
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

    const existingGuildClasses = _.map(guildClasses, (guildClass) => ({
      member_id: memberId,
      guild_class_key: guildClass,
    }));

    const updatePrimarySkills =
      newPrimarySkills.length > 0 ? newPrimarySkills : existingPrimarySkills;
    const updateSecondarySkills =
      newSecondarySkills.length > 0
        ? newSecondarySkills
        : existingSecondarySkills;
    const updateGuildClasses =
      newGuildClasses.length > 0 ? newGuildClasses : existingGuildClasses;

    await updateMemberStatus({
      member_updates: {
        name: values.memberName ?? member.name,
        is_raiding: values?.isRaiding?.value ?? member?.isRaiding,
        description: values.description ?? member?.description,
      },
      skills_updates: [...updatePrimarySkills, ...updateSecondarySkills],
      guild_classes_updates: updateGuildClasses,
      contact_info_id: member.contactInfo.id,
      contact_info_updates: {
        email: values.emailAddress ?? member?.contactInfo?.email,
        discord: values.discordHandle ?? member?.contactInfo?.discord,
        github: values.githubHandle ?? member?.contactInfo?.github,
        twitter: values.twitterHandle ?? member?.contactInfo?.twitter,
        telegram: values.telegramHandle ?? member?.contactInfo?.telegram,
      },
    });

    await refetch();
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
                  name='guildClasses'
                  label='Guild Classes'
                  isMulti
                  defaultValue={GUILD_CLASS_OPTIONS.filter((option) =>
                    guildClasses.includes(option.value)
                  )}
                  options={GUILD_CLASS_OPTIONS}
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

                <Textarea
                  name='description'
                  defaultValue={member?.description || introduction || ''}
                  aria-label='Enter your description'
                  placeholder='Tell us about yourself'
                  label='Member Description'
                  localForm={localForm}
                />

                <Button isLoading={isSubmitting || sending} type='submit'>
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
