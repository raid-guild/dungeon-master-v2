import { gql } from '@apollo/client';

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
  }
  ${DASHBOARD_RAID_FRAGMENT}
`;
