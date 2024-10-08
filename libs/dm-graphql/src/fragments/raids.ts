/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { CONSULTATION_DETAIL_FRAGMENT } from './consultations';
import { SLIM_MEMBER_DETAIL_FRAGMENT } from './members';

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
    hunter {
      ...SlimMemberDetail
    }

    raid_parties {
      member {
        ...SlimMemberDetail
      }
    }
    signalled_interests {
      id
      raid_id
      consultation_id
      member_id
      member {
        id
        name
        eth_address
        contact_info {
          ...ContactInfos
        }
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

    portfolios {
      id
      raid_id
      name
      slug
      description
      case_study
      approach
      challenge
      category
      result
      repo_link
      result_link
      image_url
    }

    locker_hash
    invoice_address
    escrow_index
    airtable_id
    v1_id
  }
  ${RAID_ENUMS_FRAGMENT}
  ${CONSULTATION_DETAIL_FRAGMENT}
  ${SLIM_MEMBER_DETAIL_FRAGMENT}
`;

export const RAID_SLIM_DETAIL_FRAGMENT = gql`
  fragment RaidDetails on raids {
    id
    v1_id
    invoice {
      chain_id
      invoice_address
    }
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
