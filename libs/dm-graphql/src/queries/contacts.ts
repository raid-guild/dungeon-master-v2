/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const ALL_CONTACTS_QUERY = gql`
  query AllContacts {
    contacts {
      id
      name
      bio
      contact_info {
        email
      }
    }
  }
`;


