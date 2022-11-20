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
      eth_address
      ens_name
      discord_handle
      introduction
      passion
      telegram_handle
      twitter_handle
      why_raidguild
      created_at
      updated_at
    }
  }
`;

export const APPLICATION_DETAIL_QUERY = gql`
  query ApplicationDetail($id: uuid!) {
    applications_by_pk(id: $id) {
      id
      name
    }
  }
`;
