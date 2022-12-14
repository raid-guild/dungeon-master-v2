import { gql } from '@apollo/client';

export const DASHBOARD_QUERY = gql`
  query DashboardQuery($address: String!) {
    my_raids: raids(
      where: { raid_parties: { member: { eth_address: { _eq: $address } } } }
      order_by: { created_at: desc }
    ) {
      id
      name
      cleric {
        name
      }
      raid_status {
        raid_status
      }
    }
    new_raids: raids(order_by: { created_at: desc }, limit: 5) {
      id
      name
      cleric {
        name
        eth_address
      }
      raid_status {
        raid_status
      }
      created_at
    }
  }
`;
