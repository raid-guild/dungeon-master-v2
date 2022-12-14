import { gql } from '@apollo/client';

export const APPLICATION_LIST_QUERY = gql`
  query ApplicationsList(
    $offset: Int!
    $limit: Int!
    $where: applications_bool_exp
  ) {
    applications(limit: $limit, offset: $offset, where: $where) {
      id
      name
      contact_info {
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
  }
`;

export const APPLICATION_DETAIL_QUERY = gql`
  query ApplicationDetail($id: uuid!) {
    applications_by_pk(id: $id) {
      cohort_availability {
        cohort_availability
      }
      crypto_experience
      crypto_thrills
      dao_familiarity {
        dao_familiarity
      }
      contact_info {
        email
        discord
        github
        telegram
        twitter
      }
      eth_address
      favorite_media
      handbook_read
      id
      introduction
      learning_goals
      name
      passion
      pledge_readiness
      referred_by_id
      technical_skill_type {
        skill_type
      }
      created_at
      updated_at
      v1_id
      why_raidguild
      applications_skills {
        skill {
          skill
        }
        skill_type {
          skill_type
        }
      }
      comments
    }
  }
`;
