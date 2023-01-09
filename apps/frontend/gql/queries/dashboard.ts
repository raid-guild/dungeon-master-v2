import { gql } from 'graphql-request';

const DASHBOARD_RAID_FRAGMENT = gql`
  fragment DashboardRaidFragment on raids {
    id
    name
    cleric {
      name
    }
    raid_status {
      raid_status
    }
    created_at
  }
`;

const DASHBOARD_CONSULTATION_FRAGMENT = gql`
  fragment DashboardConsultationFragment on consultations {
    id
    name
    created_at
  }
`;

export const DASHBOARD_QUERY = gql`
  query DashboardQuery($address: String!) {
    raid_party_raids: raids(
      where: { raid_parties: { member: { eth_address: { _eq: $address } } } }
    ) {
      ...DashboardRaidFragment
    }
    cleric_raids: raids(where: { cleric: { eth_address: { _eq: $address } } }) {
      ...DashboardRaidFragment
    }
    new_raids: raids(order_by: { created_at: desc }, limit: 5) {
      ...DashboardRaidFragment
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
      ...DashboardConsultationFragment
    }
  }
  ${DASHBOARD_RAID_FRAGMENT}
  ${DASHBOARD_CONSULTATION_FRAGMENT}
`;
