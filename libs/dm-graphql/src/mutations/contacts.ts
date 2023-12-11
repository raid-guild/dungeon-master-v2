/* eslint-disable import/prefer-default-export */

import { gql } from 'graphql-request';

import { CONTACT_INFOS_FRAGMENT } from '../fragments';

export const CREATE_CONTACT_MUTATION = gql`
  mutation InsertContact($contact: contacts_insert_input!) {
    insert_contacts(objects: [$contact]) {
      returning {
        id
        name
        bio
        eth_address
        contact_info_id
        contact_info {
          email
          discord
          github
          telegram
          twitter
        }
      }
    }
  }
`;

export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContactAndInfo(
    $id: uuid!
    $contact: contacts_set_input!
    $contact_info_id: uuid!
    $updates: contact_infos_set_input!
  ) {
    update_contacts_by_pk(pk_columns: { id: $id }, _set: $contact) {
      id
      name
      bio
      eth_address
    }
    update_contact_infos_by_pk(
      pk_columns: { id: $contact_info_id }
      _set: $updates
    ) {
      id
      email
      discord
      github
      telegram
      twitter
    }
  }
`;
