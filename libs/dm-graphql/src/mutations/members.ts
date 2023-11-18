/* eslint-disable import/prefer-default-export */
import { gql } from "graphql-request";
import { CONTACT_INFOS_FRAGMENT, MEMBER_DETAIL_FRAGMENT } from "../fragments";

export const MEMBER_UPDATE_MUTATION = gql`
  mutation MemberUpdateMutation(
    $id: uuid!,
    $member_updates: members_set_input!,
    $contact_info_pk: uuid!,
    $contact_info_updates: contact_infos_set_input!,
    $skills_updates: [members_skills_insert_input!]!
  ) {
    update_members_by_pk(
      pk_columns: { id: $id },
      _set: $member_updates
    ) {
      ...MemberDetail
    }
  delete_members_skills(where: {member_id: {_eq: $id}}) {
    affected_rows
  }
  insert_members_skills(
      objects: $skills_updates,
    ) {
      affected_rows
    }
    update_contact_infos_by_pk(
      pk_columns: { id: $contact_info_pk },
      _set: $contact_info_updates
    ) {
      ...ContactInfos
    }
  }
  ${MEMBER_DETAIL_FRAGMENT}
`;
