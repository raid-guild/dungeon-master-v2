import { gql } from 'graphql-request';

import { CONTACT_INFOS_FRAGMENT } from './contactInfo';
import { SLIM_MEMBER_DETAIL_FRAGMENT } from './members';

const APPLICATION_ENUM_FRAGMENT = gql`
  fragment ApplicationEnumFragment on applications {
    cohort_availability {
      cohort_availability
    }
    dao_familiarity {
      dao_familiarity
    }
  }
`;

export const APPLICATION_DETAIL_FRAGMENT = gql`
  fragment ApplicationDetail on applications {
    id
    v1_id
    name
    introduction
    learning_goals
    crypto_experience
    crypto_thrills
    eth_address
    passion
    pledge_readiness
    favorite_media
    handbook_read
    why_raidguild
    comments
    created_at
    updated_at
    contact_info {
      ...ContactInfos
    }
    member {
      ...SlimMemberDetail
    }
    referred_by {
      ...SlimMemberDetail
    }
    technical_skill_type {
      skill_type
    }
    applications_skills {
      skill {
        skill
      }
      skill_type {
        skill_type
      }
    }
  }
  ${APPLICATION_ENUM_FRAGMENT}
  ${SLIM_MEMBER_DETAIL_FRAGMENT}
`;

export const SLIM_APPLICATION_DETAIL_FRAGMENT = gql`
  fragment SlimApplicationDetail on applications {
    id
    name
    contact_info {
      ...ContactInfos
    }
    eth_address
    introduction
    passion
    why_raidguild
    created_at
    updated_at
  }
  ${CONTACT_INFOS_FRAGMENT}
`;
