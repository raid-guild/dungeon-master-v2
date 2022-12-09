import { gql } from '@apollo/client';

export const RAID_UPDATE_MUTATION = gql`
  mutation RaidUpdateMutation(
    $id: uuid!
    $name: String
    $status: raid_statuses_enum
    $category: raid_categories_enum
    $start_date: timestamptz
    $end_date: timestamptz
  ) {
    update_raids_by_pk(
      pk_columns: { id: $id }
      _set: {
        status: $status
        name: $name
        category: $category
        start_date: $start_date
        end_date: $end_date
      }
    ) {
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
