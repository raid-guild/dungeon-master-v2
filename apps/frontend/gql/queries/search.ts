import { gql } from '@apollo/client';

export const SEARCH_QUERY = gql`
  query Search($query: String!) {
    raids: raids(where: { name: { _ilike: $query } }) {
      id
      name
      description
    }

    consultations: consultations(where: { name: { _ilike: $query } }) {
      id
      name
      description
    }

    members: members(where: { name: { _ilike: $query } }) {
      id
      name
    }

    applications: applications(where: { name: { _ilike: $query } }) {
      id
      name
    }
  }
`;
