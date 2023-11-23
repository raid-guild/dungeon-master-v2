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
    $order_by: [applications_order_by!]
  ) {
    applications(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $order_by
    ) {
      ...SlimApplicationDetail
    }
  }
  ${SLIM_APPLICATION_DETAIL_FRAGMENT}
`;

export const APPLICATIONS_LIST_COUNT_QUERY = gql`
  query ApplicationsCountQuery($where: applications_bool_exp) {
    applications_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const APPLICATION_DETAIL_QUERY = gql`
  query ApplicationDetail($id: uuid!) {
    applications_by_pk(id: $id) {
      ...ApplicationDetail
    }
  }
  ${APPLICATION_DETAIL_FRAGMENT}
`;
