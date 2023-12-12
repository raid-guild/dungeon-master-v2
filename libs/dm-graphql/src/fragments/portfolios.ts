import { gql } from 'graphql-request';

const PORTFOLIO_DETAIL_FRAGMENT = gql`
  fragment PortfolioDetailFragment on portfolios {
    id
    raid_id
    name
    slug
    description
    case_study
    approach
    challenge
    category
    result
    repo_link
    result_link
    image_url
  }
`;

export default PORTFOLIO_DETAIL_FRAGMENT;