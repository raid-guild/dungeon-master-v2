import { gql } from '@apollo/client';

export const CONSULTATION_LIST_QUERY = gql`
  query ConsultationsList(
    $offset: Int!
    $limit: Int!
    $where: consultations_bool_exp
  ) {
    consultations(limit: $limit, offset: $offset, where: $where) {
      id
      project_name
      project_desc
      project_type
      budget
      consultations_services_reqs {
        guild_service
      }
      submission_type
    }
  }
`;

export const CONSULTATION_DETAIL_QUERY = gql`
  query ConsultationDetail($id: uuid!) {
    consultations_by_pk(id: $id) {
      id
      project_name
      project_desc
    }
  }
`;
