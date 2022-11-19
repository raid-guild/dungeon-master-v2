import { gql } from '@apollo/client';

export const MEMBER_LIST_QUERY = gql`
  query MemberList {
    members {
      id
      name
      email_address
      eth_address
    }
  }
`;

export const MEMBER_ADDRESS_LOOKUP_QUERY = gql`
  query MemberAddressLookup($address: String!) {
    members(where: { eth_address: { _eq: $address } }) {
      id
      eth_address
      name
    }
  }
`;

export const MEMBER_DETAIL_QUERY = gql`
  query MemberDetail($id: uuid!) {
    members_by_pk(id: $id) {
      id
      name
      email_address
      eth_address
    }
  }
`;
