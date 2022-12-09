import { gql } from '@apollo/client';

export const RAID_UPDATE_MUTATION = gql`
  mutation RaidUpdateMutation(
    $id: uuid!
    $name: String
    $status: raid_statuses_enum
  ) {
    update_raids_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status, name: $name }
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
  }
`;
