import { gql } from '@apollo/client';

export const MEMBER_LIST_QUERY = gql`
  query MemberList($offset: Int!, $limit: Int!, $where: members_bool_exp) {
    members(limit: $limit, offset: $offset, where: $where) {
      id
      name
      email_address
      eth_address
      ens_name
      discord_handle
      twitter_handle
      github_handle
      telegram_handle
      guild_class
      applicationByApplication {
        introduction
      }
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
