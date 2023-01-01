import { gql } from '@apollo/client';
import { RAID_DETAIL_FRAGMENT } from '../queries';

export const RAID_UPDATE_MUTATION = gql`
  mutation RaidUpdateMutation($id: uuid!, $raid_updates: raids_set_input!) {
    update_raids_by_pk(pk_columns: { id: $id }, _set: $raid_updates) {
      ...RaidDetail
    }
  }
  ${RAID_DETAIL_FRAGMENT}
`;

export const ROLES_REQUIRED_FRAGMENT = gql`
  fragment RolesRequired on raids_roles_required {
    id
    raid_id
    raid {
      ...RaidDetail
    }
    role
  }
  ${RAID_DETAIL_FRAGMENT}
`;

export const ROLES_REQUIRED_INSERT_MUTATION = gql`
  mutation RolesRequiredInsertMutation(
    $raidParty: [raids_roles_required_insert_input!]!
  ) {
    insert_raids_roles_required(objects: $raidParty) {
      returning {
        ...RolesRequired
      }
    }
  }
  ${ROLES_REQUIRED_FRAGMENT}
`;

export const ROLES_REQUIRED_DELETE_MUTATION = gql`
  mutation RolesRequiredDeleteMutation($where: raids_roles_required_bool_exp!) {
    delete_raids_roles_required(where: $where) {
      returning {
        ...RolesRequired
      }
    }
  }
  ${ROLES_REQUIRED_FRAGMENT}
`;

export const RAID_PARTY_FRAGMENT = gql`
  fragment RaidParty on raid_parties {
    id
    raid_id
    raid {
      ...RaidDetail
    }
    member_id
  }
  ${RAID_DETAIL_FRAGMENT}
`;

export const RAID_PARTY_INSERT_MUTATION = gql`
  mutation RaidPartyInsertMutation(
    $raid_parties: [raid_parties_insert_input!]!
  ) {
    insert_raid_parties(objects: $raid_parties) {
      returning {
        ...RaidParty
      }
    }
  }
  ${RAID_PARTY_FRAGMENT}
`;

export const RAID_PARTY_DELETE_MUTATION = gql`
  mutation RaidPartyDeleteMutation($where: raid_parties_bool_exp!) {
    delete_raid_parties(where: $where) {
      returning {
        ...RaidParty
      }
    }
  }
  ${RAID_PARTY_FRAGMENT}
`;
