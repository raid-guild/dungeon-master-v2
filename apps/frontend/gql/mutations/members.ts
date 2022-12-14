import { gql } from '@apollo/client';

export const MEMBER_UPDATE_MUTATION = gql`
  mutation MemberUpdateMutation(
    $id: uuid!
    $member_updates: members_set_input!
    $contact_info_pk: uuid!
    $contact_info_updates: contact_infos_set_input!
  ) {
    update_members_by_pk(pk_columns: { id: $id }, _set: $member_updates) {
      ...MemberDetail
    }
    update_contact_infos_by_pk(
      pk_columns: { id: $contact_info_pk }
      _set: $contact_info_updates
    ) {
      email
      discord
      github
      twitter
      telegram
    }
  }

  fragment MemberDetail on members {
    id
    name
    primary_class_key
    eth_address
    contact_info {
      id
      discord
      twitter
      telegram
      email
    }
  }
`;
