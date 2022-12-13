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
      comments
      availability
      crypto_experience
      cohort_availability
      crypto_thrills
      dao_familiarity
      discord_handle
      email_address
      ens_name
      eth_address
      favorite_media
      github_handle
      handbook_read
      id
      introduction
      learning_goals
      name
      passion
      pledge_readiness
      referred_by
      skill_type
      telegram_handle
      twitter_handle
      updated_at
      v1_id
      why_raidguild
      skills {
        skill
        skill_type
      }
    }
  }
`;
