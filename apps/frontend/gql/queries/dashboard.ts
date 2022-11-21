import { gql } from '@apollo/client';

export const MY_RAIDS_QUERY = gql`
  query MyRaids {
    raids {
      id
    }
  }
`;
