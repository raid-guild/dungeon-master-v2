/* eslint-disable import/prefer-default-export */

import { gql } from "graphql-request";

export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContact($contact: contacts_insert_input!) {
    insert_contacts_one(object: $contact) {
      id
      name
      bio
      contact_info {
        email
      }
    }
  }
`;

export const UPDATE_CONTACT_MUTATION = gql`
    mutation UpdateContact($id: uuid!, $contact: contacts_set_input!) {
        update_contacts_by_pk(pk_columns: { id: $id }, _set: $contact) {
        id
        name
        bio
        contact_info {
            email
        }
        }
    }
    `;