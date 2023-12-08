/* eslint-disable import/prefer-default-export */

import { gql } from 'graphql-request';

export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContactAndInfo($contactInfoData: contact_infos_insert_input!, $contactData: contacts_insert_input!) {
  insert_contact_infos_one(object: $contactInfoData) {
    id
    email
    discord
    twitter
    telegram
    github
  }
  insert_contacts_one(object: $contactData) {
    id
    name
    bio
    eth_address
    contact_info_id
  }
}

`;

export const UPDATE_CONTACT_MUTATION = gql`
 mutation UpdateContactAndInfo(
  $contactId: uuid!, 
  $contactData: contacts_set_input!, 
  $contactInfoId: uuid!, 
  $contactInfoData: contact_infos_set_input!
) {
  update_contacts_by_pk(pk_columns: { id: $contactId }, _set: $contactData) {
    id
    name
    bio
    contact_info_id
  }
  update_contact_infos_by_pk(pk_columns: { id: $contactInfoId }, _set: $contactInfoData) {
    id
    email
    discord
    twitter
    telegram
    github
  }
}

`;
