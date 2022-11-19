import { gql } from '@apollo/client';

export const APPLICATION_LIST_QUERY = gql`
  query ApplicationsList {
    applications {
      id
      name
    }
  }
`;

export const APPLICATION_DETAIL_QUERY = gql`
  query ApplicationDetail($id: uuid!) {
    applications_by_pk(id: $id) {
      id
      name
    }
  }
`;
