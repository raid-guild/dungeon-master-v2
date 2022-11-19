import { gql } from '@apollo/client';

export const CONSULTATION_LIST_QUERY = gql`
  query ConsultationsList {
    consultations {
      id
      project_name
      project_desc
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
