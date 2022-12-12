import { gql } from '@apollo/client';

export const MEMBER_UPDATE_MUTATION = gql`
  mutation MemberUpdateMutation(
    $id: uuid!
    $name: String
    $ens_name: String
    $guild_class: guild_classes_enum
    $github_handle: String
    $discord_handle: String
  ) {
    update_members_by_pk(
      pk_columns: { id: $id }
      _set: {
        name: $name
        ens_name: $ens_name
        guild_class: $guild_class
        github_handle: $github_handle
        discord_handle: $discord_handle
      }
    ) {
      ...MemberDetail
    }
  }
  fragment MemberDetail on members {
    id
    name
    email_address
    eth_address
    ens_name
    discord_handle
    twitter_handle
    github_handle
    telegram_handle
    guild_class
    applicationByApplication {
      introduction
    }
    skills {
      skill
      skill_type
    }
  }
`;
