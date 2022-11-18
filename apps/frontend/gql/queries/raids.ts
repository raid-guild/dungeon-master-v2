import { gql } from '@apollo/client';

export const RAIDS_LIST_QUERY = gql`
  query RaidsListQuery {
    raids {
      id
      name
      cleric
      airtable_id
      portfolio
      locker_hash
      escrow_index
      status
    }
  }
`;

export const RAID_DETAIL_QUERY = gql`
  query RaidDetailQuery($id: uuid!) {
    raids_by_pk(id: $id) {
      id
      name
      cleric
      airtable_id
      portfolio
      locker_hash
      escrow_index
      status
    }
  }
`;
