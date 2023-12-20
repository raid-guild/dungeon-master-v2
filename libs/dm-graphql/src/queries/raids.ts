import { gql } from 'graphql-request';

import {
  CONTACT_INFOS_FRAGMENT,
  RAID_DETAIL_FRAGMENT,
  RAID_SLIM_DETAIL_FRAGMENT
} from '../fragments';

export const RAIDING_RAIDS_BY_LAST_UPDATE = gql`
  query RaidsByLastUpdate($latest_update_order_by: order_by) {
    raiding_raids_by_last_update(
      order_by: { latest_update_created_at: $latest_update_order_by }
    ) {
      latest_update_created_at
      latest_update
      raid_id
      raid_name
    }
  }
`;

export const RAIDS_LIST_AND_LAST_UPDATE_QUERY = gql`
  query RaidsListQuery(
    $offset: Int!
    $limit: Int!
    $where: raids_bool_exp
    $order_by: [raids_order_by!]
    $latest_update_order_by: [raiding_raids_by_last_update_order_by!]
  ) {
    raids(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {
      ...RaidDetail
    }
    raiding_raids_by_last_update(order_by: $latest_update_order_by) {
      raid_id
    }
  }
  # ${RAID_DETAIL_FRAGMENT}
`;

export const RAIDS_LIST_QUERY = gql`
  query RaidsListQuery(
    $offset: Int!
    $limit: Int!
    $where: raids_bool_exp
    $order_by: [raids_order_by!]
  ) {
    raids(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {
      ...RaidDetail
    }
    raids_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
  # ${RAID_DETAIL_FRAGMENT}
`;

export const RAIDS_COUNT_QUERY = gql`
  query RaidsCountQuery($where: raids_bool_exp) {
    raids_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const RAID_DETAIL_QUERY = gql`
  query RaidDetailQuery($id: uuid!) {
    raids_by_pk(id: $id) {
      id
      name
      signalled_interests{
            id
            raid_id
            consultation_id
            member_id
    }
      raid_status {
        raid_status
      }
      raid_category {
        raid_category
      }
      created_at
      raids_roles_required {
        role
      }
      start_date
      end_date
      cleric {
        eth_address
        name
        id
        guild_class {
          guild_class
        }
      }
      consultation {
        id
        links {
          id
          link
          type
        }
        signalled_interests {
        id
        member_id
        raid_id
        consultation_id
      }
        budget_option {
          budget_option
        }
        consultation_hash
        consultations_services_required {
          guild_service {
            guild_service
          }
        }
        consultations_contacts {
          contact {
            id
            name
            bio
            contact_info_id
            contact_info {
              ...ContactInfos
            }
          }
        }
        desired_delivery_date
        delivery_priority {
          delivery_priority
        }
        description
        link
        specs_key
        project_type {
          project_type
        }
        submission_type {
          submission_type
        }
      }
      locker_hash
      invoice_address
      escrow_index
      airtable_id
      v1_id
      raid_parties {
        member {
          eth_address
          name
          id
          contact_info {
        ...ContactInfos
      }
          guild_class {
            guild_class
          }
        }
      }
      updates {
        id
        update
        member {
          name
          eth_address
          id
        }
        created_at
      }
      portfolios {
        id
        raid_id
        name
        slug
        description
        case_study
        approach
        challenge
        category
        result
        repo_link
        result_link
        image_url
      }
      created_at
      updated_at
    }
  }
  ${CONTACT_INFOS_FRAGMENT}
`;

export const RAID_BY_ID_QUERY = gql`
  query validateRaidId($raidId: uuid) {
    raids(where: { id: { _eq: $raidId } }) {
      ...RaidDetails
    }
  }
  ${RAID_SLIM_DETAIL_FRAGMENT}
`;

export const RAID_BY_V1_ID_QUERY = gql`
  query validateRaidId($v1Id: String) {
    raids(where: { v1_id: { _eq: $v1Id } }) {
      ...RaidDetails
    }
  }
  ${RAID_SLIM_DETAIL_FRAGMENT}
`;
