/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import {PORTFOLIO_DETAIL_FRAGMENT} from '../fragments';

export const PORTFOLIO_INSERT_MUTATION = gql`
  mutation PortfolioInsertMutation($portfolio: portfolios_insert_input!) {
    insert_portfolios_one(object: $portfolio) {
      ...PortfolioDetailFragment
    }
  }
  ${PORTFOLIO_DETAIL_FRAGMENT}
`;

export const PORTFOLIO_UPDATE_MUTATION = gql`
  mutation updatePortfolios($portfolio_id: uuid!, $portfolio: portfolios_set_input!) {
    update_portfolios(where: {id: {_eq: $portfolio_id}}, _set: $portfolio) {
      ...PortfolioDetailFragment
    }
  }
  ${PORTFOLIO_DETAIL_FRAGMENT}
`;
