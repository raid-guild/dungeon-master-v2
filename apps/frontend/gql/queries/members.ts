import { gql } from 'graphql-request';
import {
  CONTACT_INFO_FRAGMENT,
  MEMBER_DETAIL_FRAGMENT,
  SLIM_MEMBER_DETAIL_FRAGMENT,
} from '../fragments';

export const MEMBER_LIST_QUERY = gql`
  query MemberList(
    $offset: Int!
    $limit: Int!
    $where: members_bool_exp
    $order_by: [members_order_by!]
  ) {
    members(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $order_by
    ) {
      id
      name
      eth_address
      is_raiding
      contact_info {
        ...ContactInfos
      }
      guild_class {
        guild_class
      }
      application {
        introduction
      }
      member_type {
        member_type
      }
    }
  }
  ${CONTACT_INFO_FRAGMENT}
`;

export const MEMBER_SLIM_LIST_QUERY = gql`
  query MemberSlimList {
    members {
      ...SlimMemberDetail
    }
  }
  ${SLIM_MEMBER_DETAIL_FRAGMENT}
`;

export const MEMBER_ADDRESS_LOOKUP_QUERY = gql`
  query MemberAddressLookup($address: String!) {
    members(where: { eth_address: { _eq: $address } }) {
      ...MemberDetail
    }
    cleric_raids: raids(where: { cleric: { eth_address: { _eq: $address } } }) {
      id
      name
      raid_status {
        raid_status
      }
    }
  }
  ${MEMBER_DETAIL_FRAGMENT}
`;

export const MEMBERS_COUNT_QUERY = gql`
  query MembersCountQuery($where: members_bool_exp) {
    members_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

// ! use MEMBER_ADDRESS_LOOKUP_QUERY so we can use `address` as the slug
export const MEMBER_DETAIL_QUERY = gql`
  query MemberDetail($id: uuid!) {
    members_by_pk(id: $id) {
      ...MemberDetail
    }
  }
  ${MEMBER_DETAIL_FRAGMENT}
`;

export const MEMBER_CREATE_MUTATION = gql`
  mutation MemberCreate($member: members_insert_input!) {
    insert_members_one(object: $member) {
      ...MemberDetail
    }
  }
  ${MEMBER_DETAIL_FRAGMENT}
`;
