import { gql } from '@apollo/client';

export const CONSULTATION_LIST_QUERY = gql`
  query ConsultationsList(
    $offset: Int!
    $limit: Int!
    $where: consultations_bool_exp
  ) {
    consultations(limit: $limit, offset: $offset, where: $where) {
      id
      budget
      consultation_hash
      services_required {
        guild_service
      }
      contact_name
      contact_bio
      contact_email
      desired_delivery
      delivery_priorities
      project_name
      project_desc
      project_link
      project_specs
      project_type
      submission_type
    }
  }
`;

export const CONSULTATION_DETAIL_QUERY = gql`
  query ConsultationDetail($id: uuid!) {
    consultations_by_pk(id: $id) {
      id
      budget
      consultation_hash
      services_required {
        guild_service
      }
      contact_name
      contact_bio
      contact_email
      desired_delivery
      delivery_priorities
      project_name
      project_desc
      project_link
      project_specs
      project_type
      submission_type
    }
  }
`;
