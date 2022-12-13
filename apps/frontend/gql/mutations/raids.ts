import { gql } from '@apollo/client';

// mutation insertConsultation($consultation: consultations_insert_input!) {
//   insert_consultations(objects: [$consultation]) {
//     returning {
//       id
//     }
//   }
// }

export const RAID_UPDATE_MUTATION = gql`
  mutation RaidUpdateMutation($id: uuid!, $raid_updates: raids_set_input!) {
    update_raids_by_pk(pk_columns: { id: $id }, _set: $raid_updates) {
      ...RaidDetail
    }
  }
  fragment RaidDetail on raids {
    id
    name
    status
    category
    roles_required {
      role
    }
    consultationByConsultation {
      project_desc
      budget
      services_required {
        guild_service
      }
      submission_type
      project_type
    }
    created_at
    updated_at
    start_date
    end_date
  }
`;
