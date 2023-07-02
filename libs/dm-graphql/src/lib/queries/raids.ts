import { gql } from 'graphql-request';
import { RAID_DETAIL_FRAGMENT } from '../fragments';

// export const RAID_VIEWER_QUERY = gql`
//   query RaidViewerQuery(

//   )
// `;

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
            name
            bio
            contact_info {
              email
              twitter
              telegram
              discord
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
      created_at
      updated_at
    }
  }
`;
