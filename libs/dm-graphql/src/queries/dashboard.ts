/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

const DASHBOARD_CONSULTATION_FRAGMENT = gql`
  fragment DashboardConsultation on consultations {
    id
    name
    created_at
  }
`;

const DASHBOARD_RAID_FRAGMENT = gql`
  fragment DashboardRaid on raids {
    id
    name
    cleric {
      name
    }
    raid_status {
      raid_status
    }
    consultation {
      ...DashboardConsultation
    }
    created_at
  }
`;

export const DASHBOARD_QUERY = gql`
  query DashboardQuery($address: String!) {
    raid_party_raids: raids(
      where: { raid_parties: { member: { eth_address: { _eq: $address } } } }
    ) {
      ...DashboardRaid
    }
    cleric_raids: raids(where: { cleric: { eth_address: { _eq: $address } } }) {
      ...DashboardRaid
    }
    new_raids: raids(order_by: { created_at: desc }, limit: 5) {
      ...DashboardRaid
    }
    new_consultations: consultations(
      order_by: { created_at: desc }
      limit: 5
      where: {
        _and: {
          _not: { raids: {} }
          consultation_status_key: { _neq: CANCELLED }
        }
      }
    ) {
      ...DashboardConsultation
    }
  }
  ${DASHBOARD_RAID_FRAGMENT}
  ${DASHBOARD_CONSULTATION_FRAGMENT}
`;
