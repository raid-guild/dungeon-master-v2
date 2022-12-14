import { gql } from '@apollo/client';

export const MEMBER_UPDATE_MUTATION = gql`
  mutation MemberUpdateMutation(
    $id: uuid!
    $member_updates: members_set_input!
  ) {
    update_members_by_pk(pk_columns: { id: $id }, _set: $member_updates) {
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
    github_handledodocke
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
