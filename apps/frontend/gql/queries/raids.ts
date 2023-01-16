import { gql } from 'graphql-request';

export const RAID_DETAIL_FRAGMENT = gql`
  fragment RaidDetail on raids {
    id
    name
    category_key
    status_key
    raid_status {
      raid_status
    }
    raid_category {
      raid_category
    }
    raids_roles_required {
      role
    }
    cleric {
      id
      name
      eth_address
      contact_info {
        telegram
      }
    }
    raid_parties {
      member {
        name
        eth_address
        contact_info {
          telegram
        }
      }
    }
    consultation {
      description
      budget_key
      submission_type_key
      project_type {
        project_type
      }
      budget_option {
        budget_option
      }
      consultations_services_required {
        guild_service {
          guild_service
        }
      }
      submission_type {
        submission_type
      }
      project_type {
        project_type
      }
    }
    updates(order_by: { created_at: desc }, limit: 1) {
      created_at
      id
      member {
        name
        eth_address
        id
      }
      update
    }
    created_at
    updated_at
    start_date
    end_date
  }
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
