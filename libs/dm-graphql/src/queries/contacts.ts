/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { CONTACT_INFOS_FRAGMENT } from '../fragments';

export const ALL_CONTACTS_QUERY = gql`
  query AllContacts {
    contacts {
      id
      name
      bio
      eth_address
      contact_info {
        ...ContactInfos
      }
    }
  }
  ${CONTACT_INFOS_FRAGMENT}
`;


