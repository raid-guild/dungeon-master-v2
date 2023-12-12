import { gql } from 'graphql-request';

import PORTFOLIO_DETAIL_FRAGMENT from '../fragments/portfolios';



export const PORTFOLIO_LIST_QUERY = gql`
  query PortfolioList {
    portfolios {
      ...PortfolioDetailFragment
    }
  }
  ${PORTFOLIO_DETAIL_FRAGMENT}
`;


export const PORTFOLIO_DETAIL_QUERY = gql`
  query PortfolioDetail($where: !) {
    portfolios($where: ) {
      ...PortfolioDetailFragment
    }
  }
  ${PORTFOLIO_DETAIL_FRAGMENT}
`;
