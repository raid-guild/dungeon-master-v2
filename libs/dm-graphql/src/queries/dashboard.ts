/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { CONSULTATION_DETAIL_FRAGMENT } from '../fragments';

const DASHBOARD_RAID_FRAGMENT = gql`
  fragment DashboardRaid on raids {
    id
    name
    cleric {
      name
    }
    signalled_interests {
      id
      raid_id
      consultation_id
      member_id
    }
    raid_status {
      raid_status
    }
    consultation {
      ...ConsultationDetail
    }
    created_at
    updated_at
  }
  ${CONSULTATION_DETAIL_FRAGMENT}
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
      ...ConsultationDetail
    }
  }
  ${DASHBOARD_RAID_FRAGMENT}
`;
