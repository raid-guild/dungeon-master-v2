/* eslint-disable import/prefer-default-export */

import { gql } from 'graphql-request';

export const INSERT_INTEREST_SIGNAL = gql`

mutation InsertSignalledInterestOne($interest_data: signalled_interest_insert_input!) {
    insert_signalled_interest_one(object: $interest_data) {
      id
      consultation_id
      member_id
      raid_id
    }
  };`
  
export const DELETE_INTEREST_SIGNAL = gql`
  mutation DeleteSignalledInterest($id: uuid!) {
    delete_signalled_interest_by_pk(id: $id) {
        id
    }
};
`