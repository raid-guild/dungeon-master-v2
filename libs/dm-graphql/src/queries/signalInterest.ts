/* eslint-disable import/prefer-default-export */

import { gql } from 'graphql-request';

export const ALL_SIGNALS = gql`
  query SignalledInterest {
    signalled_interest {
      id
      consultation_id
      raid_id
      member_id
    }
  }
`;
