/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { CONSULTATION_DETAIL_FRAGMENT } from '../fragments';

// const DASHBOARD_CONSULTATION_FRAGMENT = gql`
//   fragment DashboardConsultation on consultations {
//     id
//     name
//     created_at
//     links {
//       link
//       link_type {
//         type
//       }
//     }
//     link
//     consultations_services_required {
//       guild_service {
//         guild_service
//       }
//     }
//     project_type {
//       project_type
//     }
//     budget_option {
//       budget_option
//     }
//     consultation_status {
//       consultation_status
//     }
//     consultations_contacts {
//       contact {
//         name
//         bio
//         contact_info {
//           email
//           github
//           twitter
//           discord
//         }
//       }
//     }
//   }
// `;

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
      ...ConsultationDetail
    }
    created_at
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
