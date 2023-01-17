import { gql } from 'graphql-request';
import { CONTACT_INFO_FRAGMENT } from './contactInfo';

export const SLIM_MEMBER_DETAIL_FRAGMENT = gql`
  fragment SlimMemberDetailFragment on members {
    id
    name
    eth_address
    is_raiding
    contact_info {
      ...ContactInfo
    }
    guild_class {
      guild_class
    }
  }
  ${CONTACT_INFO_FRAGMENT}
`;

const MEMBER_ENUM_FRAGMENT = gql`
  fragment MemberEnumFragment on members {
    guild_class {
      guild_class
    }
    member_type {
      member_type
    }
  }
`;

export const MEMBER_DETAIL_FRAGMENT = gql`
  fragment MemberDetailFragment on members {
    id

    name
    eth_address
    is_raiding
    ...MemberEnumFragment

    contact_info {
      ...ContactInfo
    }

    application {
      introduction
    }

    members_skills {
      skill {
        skill
      }
      skill_type {
        skill_type
      }
    }

    raid_parties {
      raid {
        name
        id
        raid_status {
          raid_status
        }
      }
    }
  }
  ${MEMBER_ENUM_FRAGMENT}
  ${CONTACT_INFO_FRAGMENT}
`;
