/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { CONSULTATION_DETAIL_FRAGMENT } from './consultations';
import { SLIM_MEMBER_DETAIL_FRAGMENT } from './members';
import PORTFOLIO_DETAIL_FRAGMENT from './portfolios';

const RAID_ENUMS_FRAGMENT = gql`
  fragment RaidEnums on raids {
    category_key
    status_key
    raid_status {
      raid_status
    }
    raid_category {
      raid_category
    }
    raids_roles_required {
      role
    }
  }
`;

export const RAID_DETAIL_FRAGMENT = gql`
  fragment RaidDetail on raids {
    id
    name
    created_at
    updated_at
    start_date
    end_date
    ...RaidEnums

    cleric {
      ...SlimMemberDetail
    }

    raid_parties {
      member {
        ...SlimMemberDetail
      }
    }

    consultation {
      ...ConsultationDetail
    }

    updates(order_by: { created_at: desc }, limit: 1) {
      created_at
      id
      member {
        name
        eth_address
        id
      }
      update
    }
  }
  ${RAID_ENUMS_FRAGMENT}
  ${CONSULTATION_DETAIL_FRAGMENT}
  ${SLIM_MEMBER_DETAIL_FRAGMENT}
`;

export const RAID_SLIM_DETAIL_FRAGMENT = gql`
  fragment RaidDetails on raids {
    id
    v1_id
    invoice_address
    name
    start_date
    end_date
    consultation {
      consultations_contacts {
        contact {
          name
        }
      }
    }
  }
`;
