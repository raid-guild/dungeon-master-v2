import { gql } from '@apollo/client';

// WRAP QUERY IN %QUERY% TO ENABLE FUZZY SEARCH
export const SEARCH_QUERY = gql`
  query Search($search: String!) {
    raids: raids(where: { _or: { name: { _ilike: $search } } }, limit: 5) {
      id
      name
    }

    consultations: consultations(
      where: {
        _or: { name: { _ilike: $search }, description: { _ilike: $search } }
      }
      limit: 5
    ) {
      id
      name
      description
    }

    members: members(where: { name: { _ilike: $search } }, limit: 5) {
      id
      eth_address
      name
    }

    applications: applications(where: { name: { _ilike: $search } }, limit: 5) {
      id
      name
    }
  }
`;
