import { gql } from 'graphql-request';
import { CONTACT_INFO_FRAGMENT } from './contactInfo';

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
  fragment ApplicationDetailFragment on applications {
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
      ...ContactInfo
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
  ${CONTACT_INFO_FRAGMENT}
`;

export const SLIM_APPLICATION_DETAIL_FRAGMENT = gql`
  fragment SlimApplicationDetailFragment on applications {
    id
    name
    contact_info {
      id
      email
      discord
      telegram
      twitter
      github
    }
    eth_address
    introduction
    passion
    why_raidguild
    created_at
    updated_at
  }
`;
