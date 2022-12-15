import { gql } from '@apollo/client';

export const RAID_UPDATE_MUTATION = gql`
  mutation RaidUpdateMutation($id: uuid!, $raid_updates: raids_set_input!) {
    update_raids_by_pk(pk_columns: { id: $id }, _set: $raid_updates) {
      ...RaidDetail
    }
  }
  fragment RaidDetail on raids {
    id
    name
    status_key
    category_key
    created_at
    updated_at
    start_date
    end_date
    raids_roles_required {
      role
    }
    consultation {
      description
      budget_key
      submission_type_key
      project_type {
        project_type
      }
    }
    cleric {
      id
      name
      eth_address
      contact_info {
        telegram
      }
    }
  }
`;
