import { gql } from 'graphql-request';
import { APPLICATION_DETAIL_FRAGMENT } from '../fragments/applications';

export const APPLICATION_LIST_QUERY = gql`
  query ApplicationsList(
    $offset: Int!
    $limit: Int!
    $where: applications_bool_exp
  ) {
    applications(limit: $limit, offset: $offset, where: $where) {
      ...SlimApplicationDetailFragment
    }
  }
`;

export const APPLICATION_DETAIL_QUERY = gql`
  query ApplicationDetail($id: uuid!) {
    applications_by_pk(id: $id) {
      ...ApplicationDetailFragment
    }
  }
  ${APPLICATION_DETAIL_FRAGMENT}
`;
