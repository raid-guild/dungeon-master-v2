import { gql } from '@apollo/client';

export const MEMBER_LIST_QUERY = gql`
  query MemberList($offset: Int!, $limit: Int!, $where: members_bool_exp) {
    members(limit: $limit, offset: $offset, where: $where) {
      id
      name
      eth_address
      contact_info {
        email
        discord
        telegram
        twitter
        github
      }
      guild_class
      application {
        introduction
      }
    }
  }
`;

export const MEMBER_SLIM_LIST_QUERY = gql`
  query MemberSlimList {
    members {
      id
      name
      eth_address
      contact_info {
        telegram
      }
      guild_class
    }
  }
`;

export const MEMBER_ADDRESS_LOOKUP_QUERY = gql`
  query MemberAddressLookup($address: String!) {
    members(where: { eth_address: { _eq: $address } }) {
      id
      name
      eth_address
      contact_info {
        email
        discord
        twitter
        github
        telegram
      }
      guild_class
      application {
        introduction
      }
      skills {
        skill
        skill_type
      }
    }
  }
`;

// ! use MEMBER_ADDRESS_LOOKUP_QUERY so we can use `address` as the slug
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

export const MEMBER_CREATE_MUTATION = gql`
  mutation MemberCreate($address: String!) {
    insert_members_one(object: { eth_address: $address }) {
      id
      eth_address
    }
  }
`;
