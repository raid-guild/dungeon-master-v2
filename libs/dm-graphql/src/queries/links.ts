/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const LINKS_BY_RAID_QUERY = gql`
  query LinksByRaid($raid_id: uuid!) {
    links(where: { raid_id: { _eq: $raid_id } }) {
      id
      link
      link_type {
        link_type
      }
      raid_id
      consultation_id
    }
  }
`;

export const LINKS_BY_CONSULTATION_QUERY = gql`
  query LinksByConsultation($consultation_id: uuid!) {
    links(where: { consultation_id: { _eq: $consultation_id } }) {
      id
      link
      link_type {
        link_type
      }
      raid_id
      consultation_id
    }
  }
`;
