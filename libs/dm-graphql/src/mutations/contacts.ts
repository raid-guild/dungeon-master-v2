/* eslint-disable import/prefer-default-export */

import { gql } from 'graphql-request';

// export const CREATE_CONTACT_MUTATION = gql`
//   mutation CreateContactAndInfo($contactInfoData: contact_infos_insert_input!, $contactData: contacts_insert_input!) {
//   insert_contact_infos_one(object: $contactInfoData) {
//     id
//     email
//     discord
//     twitter
//     telegram
//     github
//   }
//   insert_contacts_one(object: $contactData) {
//     id
//     name
//     bio
//     eth_address
//     contact_info_id
//   }
// }

// `;

export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContactAndInfo(
    $id: uuid!, 
    $contact: contacts_set_input!, 
    $contact_info_id: uuid!, 
    $updates: contact_infos_set_input!
  ) {
    update_contacts_by_pk(pk_columns: { id: $id }, _set: $contact) {
      id
      name
      bio
      eth_address
    }
    update_contact_infos_by_pk(pk_columns: { id: $contact_info_id }, _set: $updates) {
      id
      email
      discord
      github
      telegram
      twitter
    }
  }
`;
