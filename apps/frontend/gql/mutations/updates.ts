import { gql } from 'graphql-request';
import { RAID_DETAIL_FRAGMENT } from '../index';

export const STATUS_UPDATE_CREATE_MUTATION = gql`
  mutation StatusUpdateCreateMutation($update: updates_insert_input!) {
    insert_updates_one(object: $update) {
      id
      update
      created_at
      updated_at
      raid {
        ...RaidDetail
      }
      member {
        id
        name
        eth_address
        contact_info {
          discord
          telegram
        }
      }
    }
  }
  ${RAID_DETAIL_FRAGMENT}
`;
