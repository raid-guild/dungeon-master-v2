import { gql } from '@apollo/client';

export const RAIDS_LIST_QUERY = gql`
  query RaidsListQuery {
    raids(order_by: { date: desc }) {
      id
      cleric
      airtable_id
      portfolio
      locker_hash
      escrow_index
      status
    }
  }
`;
