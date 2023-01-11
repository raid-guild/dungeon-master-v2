import { gql } from 'graphql-request';

export const TOKEN_PRICES_QUERY = gql`
  query {
    treasury_token_history {
      id
      date
      price_usd
      token_name
    }
  }
`;
