import { gql } from 'graphql-request';

import { CONTACT_INFOS_FRAGMENT } from './contactInfo';

export const SLIM_MEMBER_DETAIL_FRAGMENT = gql`
  fragment SlimMemberDetail on members {
    id
    name
    eth_address
    is_raiding
    contact_info {
      ...ContactInfos
    }
    member_type {
      member_type
    }
    members_guild_classes {
      guild_class_key
    }
  }
  ${CONTACT_INFOS_FRAGMENT}
`;

const MEMBER_ENUM_FRAGMENT = gql`
  fragment MemberEnum on members {
    guild_class {
      guild_class
    }
    member_type {
      member_type
    }
  }
`;

export const MEMBER_DETAIL_FRAGMENT = gql`
  fragment MemberDetail on members {
    id

    name
    eth_address
    is_raiding
    description
    ...MemberEnum

    contact_info {
      ...ContactInfos
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

    members_guild_classes {
      guild_class_key
    }

    raid_parties {
      raid {
        name
        id
        raid_status {
          raid_status
        }
        updated_at
      }
    }
  }
  ${MEMBER_ENUM_FRAGMENT}
  # ${CONTACT_INFOS_FRAGMENT}
`;
