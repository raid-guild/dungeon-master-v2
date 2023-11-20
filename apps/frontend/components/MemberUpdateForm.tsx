import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Input,
  Select,
  Stack,
} from "@raidguild/design-system";
import { useMemberUpdate } from "@raidguild/dm-hooks";
import {
  GUILD_CLASS_OPTIONS,
  IApplication,
  IMember,
  IS_RAIDING_OPTIONS,
  SKILLS_DISPLAY_OPTIONS,
} from "@raidguild/dm-utils";
import { sk } from "date-fns/locale";
import type { ISkill } from "libs/dm-types/src/misc";
import _ from "lodash";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
  const token = _.get(session, "token");
  const { mutateAsync: updateMemberStatus } = useMemberUpdate({
    token,
    memberId,
    memberAddress,
  });

  const localForm = useForm({
    mode: "all",
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = localForm;

  async function onSubmit(values) {
    setSending(true);

    console.log(values);

    const skills = _.flatMap(
      values.primarySkills,
      (skill) => ({
        skill_key: skill.value,
        skill_type_key: "PRIMARY",
        member_id: memberId,
      }),
    ).concat(
      _.flatMap(
        values.secondarySkills,
        (skill) => ({
          skill_key: skill.value,
          skill_type_key: "SECONDARY",
          member_id: memberId,
        }),
      ),
    );

    const existingSkills = _.flatMap(
      member["membersSkills"],
      (skill) => ({
        skill_key: skill.skill.skill,
        skill_type_key: skill.skillType.skillType,
        member_id: memberId,
      }),
    );

    const updateskills = (skills.length != 0) ? skills : existingSkills;

    await updateMemberStatus({
      member_updates: {
        name: values.memberName ?? member.name,
        primary_class_key: values.guildClass?.value ??
          member.guildClass.guildClass,
        is_raiding: values?.isRaiding?.value ?? member.isRaiding,
      },
      skills_updates: updateskills,
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
  const primarySkills = _.chain(member["membersSkills"])
    .filter({ skillType: { skillType: "PRIMARY" } })
    .map("skill.skill")
    .value();

  const secondarySkills = _.chain(member["membersSkills"])
    .filter({ skillType: { skillType: "SECONDARY" } })
    .map("skill.skill")
    .value();

  console.log(member);

  return (
    <Box as="section">
      <Box
        bg="gray.800"
        shadow="lg"
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
                  name="memberName"
                  defaultValue={member?.name ? member.name : ""}
                  aria-label="Enter your name"
                  placeholder="What is your name?"
                  rounded="base"
                  label="Member Name"
                  localForm={localForm}
                />
                <Input
                  name="emailAddress"
                  defaultValue={member?.contactInfo?.email
                    ? member?.contactInfo.email
                    : null}
                  aria-label="Enter your email address"
                  placeholder="What is your email address?"
                  rounded="base"
                  label="Email Address"
                  localForm={localForm}
                />
                <Input
                  name="githubHandle"
                  defaultValue={member?.contactInfo?.github
                    ? member?.contactInfo.github
                    : null}
                  aria-label="Enter your GitHub handle"
                  placeholder="What is your GitHub handle?"
                  rounded="base"
                  label="GitHub Handle"
                  localForm={localForm}
                />
                <Input
                  name="discordHandle"
                  defaultValue={member?.contactInfo?.discord
                    ? member?.contactInfo.discord
                    : null}
                  aria-label="Enter your Discord handle"
                  placeholder="What is your Discord handle?"
                  rounded="base"
                  label="Discord Handle"
                  localForm={localForm}
                />
                <Input
                  name="telegramHandle"
                  defaultValue={member?.contactInfo?.telegram
                    ? member?.contactInfo.telegram
                    : null}
                  aria-label="Enter your Telegram handle"
                  placeholder="What is your Telegram handle?"
                  rounded="base"
                  label="Telegram Handle"
                  localForm={localForm}
                />
                <Input
                  name="twitterHandle"
                  defaultValue={member?.contactInfo?.twitter
                    ? member?.contactInfo.twitter
                    : null}
                  aria-label="Enter your Twitter handle"
                  placeholder="What is your Twitter handle?"
                  rounded="base"
                  label="Twitter Handle"
                  localForm={localForm}
                />
                <FormControl>
                  <FormLabel color="raid">Guild Class</FormLabel>
                  <Controller
                    name="guildClass"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          ...field
                        }
                        options={GUILD_CLASS_OPTIONS}
                        defaultValue={GUILD_CLASS_OPTIONS.find(
                          (option) =>
                            option.value === member?.guildClass?.guildClass,
                        ) ?? null}
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
                        isMulti
                        defaultValue={SKILLS_DISPLAY_OPTIONS.filter((option) =>
                          primarySkills.includes(option.value)
                        )}
                        {
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          ...field
                        }
                        options={SKILLS_DISPLAY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="raid">Secondary Skills</FormLabel>
                  <Controller
                    name="secondarySkills"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isMulti
                        defaultValue={SKILLS_DISPLAY_OPTIONS.filter((option) =>
                          secondarySkills.includes(option.value)
                        )}
                        {
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          ...field
                        }
                        options={SKILLS_DISPLAY_OPTIONS}
                        localForm={localForm}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="raid">Raiding?</FormLabel>
                  <Controller
                    name="isRaiding"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={IS_RAIDING_OPTIONS.filter((option) =>
                          option.value === member?.isRaiding
                        ) ?? { value: false, label: "Not Raiding" }}
                        {
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          ...field
                        }
                        options={IS_RAIDING_OPTIONS}
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
