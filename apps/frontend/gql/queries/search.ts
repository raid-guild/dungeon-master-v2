import { gql } from '@apollo/client';

// WRAP QUERY IN %QUERY% TO ENABLE FUZZY SEARCH
export const SEARCH_QUERY = gql`
  query Search($search: String!) {
    raids: raids(where: { _or: { name: { _ilike: $search } } }) {
      id
      name
    }

    consultations: consultations(
      where: {
        _or: { name: { _ilike: $search }, description: { _ilike: $search } }
      }
    ) {
      id
      name
      description
    }

    members: members(where: { name: { _ilike: $search } }) {
      id
      name
    }

    applications: applications(where: { name: { _ilike: $search } }) {
      id
      name
    }
  }
`;
