import { gql } from 'graphql-request';

import { CONSULTATION_DETAIL_FRAGMENT } from '../queries/consultations';

export const CONSULTATION_UPDATE_MUTATION = gql`
  mutation ConsultationUpdate($id: uuid!, $update: consultations_set_input!) {
    update_consultations_by_pk(pk_columns: { id: $id }, _set: $update) {
      ...ConsultationDetail
    }
  }
  ${CONSULTATION_DETAIL_FRAGMENT}
`;
