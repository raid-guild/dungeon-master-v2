import { gql } from 'graphql-request';
import {
  APPLICATION_DETAIL_FRAGMENT,
  SLIM_APPLICATION_DETAIL_FRAGMENT,
} from '../fragments/applications';

export const APPLICATION_LIST_QUERY = gql`
  query ApplicationsList(
    $offset: Int!
    $limit: Int!
    $where: applications_bool_exp
  ) {
    applications(limit: $limit, offset: $offset, where: $where) {
      ...SlimApplicationDetail
    }
  }
  ${SLIM_APPLICATION_DETAIL_FRAGMENT}
`;

export const APPLICATION_DETAIL_QUERY = gql`
  query ApplicationDetail($id: uuid!) {
    applications_by_pk(id: $id) {
      ...ApplicationDetail
    }
  }
  ${APPLICATION_DETAIL_FRAGMENT}
`;
