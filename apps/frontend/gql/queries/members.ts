import { gql } from 'graphql-request';

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
        id
        email
        discord
        telegram
        twitter
        github
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
`;

export const MEMBER_SLIM_LIST_QUERY = gql`
  query MemberSlimList {
    members {
      id
      name
      eth_address
      is_raiding
      contact_info {
        telegram
      }
      guild_class {
        guild_class
      }
    }
  }
`;

export const MEMBER_DETAIL_FRAGMENT = gql`
  fragment MemberDetailFragment on members {
    id
    name
    eth_address
    is_raiding
    contact_info {
      id
      email
      discord
      twitter
      github
      telegram
    }
    guild_class {
      guild_class
    }
    application {
      introduction
    }
    members_skills {
      skill {
        skill
      }
      skill_type {
        skill_type
      }
    }
    member_type {
      member_type
    }
    raid_parties {
      raid {
        name
        id
        raid_status {
          raid_status
        }
      }
    }
  }
`;

export const MEMBER_ADDRESS_LOOKUP_QUERY = gql`
  query MemberAddressLookup($address: String!) {
    members(where: { eth_address: { _eq: $address } }) {
      ...MemberDetailFragment
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

// ! use MEMBER_ADDRESS_LOOKUP_QUERY so we can use `address` as the slug
export const MEMBER_DETAIL_QUERY = gql`
  query MemberDetail($id: uuid!) {
    members_by_pk(id: $id) {
      ...MemberDetailFragment
    }
  }
  ${MEMBER_DETAIL_FRAGMENT}
`;

export const MEMBER_CREATE_MUTATION = gql`
  mutation MemberCreate($member: members_insert_input!) {
    insert_members_one(object: $member) {
      ...MemberDetailFragment
    }
  }
  ${MEMBER_DETAIL_FRAGMENT}
`;
