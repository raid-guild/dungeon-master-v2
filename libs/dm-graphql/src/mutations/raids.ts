import { gql } from 'graphql-request';

import { RAID_DETAIL_FRAGMENT } from '../fragments';

export const RAID_UPDATE_MUTATION = gql`
  mutation RaidUpdateMutation(
    $id: uuid!
    $raid_updates: raids_set_input!
    $consultation_updates: consultations_set_input!
    $consultation_id: uuid!
  ) {
    update_raids_by_pk(pk_columns: { id: $id }, _set: $raid_updates) {
      ...RaidDetail
    }
    update_consultations_by_pk(
      pk_columns: { id: $consultation_id }
      _set: $consultation_updates
    ) {
      ...ConsultationDetail
    }
  }
  ${RAID_DETAIL_FRAGMENT}
`;

export const RAID_MINI_UPDATE_MUTATION = gql`
  mutation RaidMiniUpdateMutation($id: uuid!, $raid_updates: raids_set_input!) {
    update_raids_by_pk(pk_columns: { id: $id }, _set: $raid_updates) {
      ...RaidDetail
    }
  }
  ${RAID_DETAIL_FRAGMENT}
`;

export const RAID_CREATE_MUTATION = gql`
  mutation RaidCreateMutation($raid: raids_insert_input!) {
    insert_raids_one(object: $raid) {
      ...RaidDetail
    }
  }
  ${RAID_DETAIL_FRAGMENT}
`;

export const ROLES_REQUIRED_FRAGMENT = gql`
  fragment RolesRequired on raids_roles_required {
    id
    raid_id
    role
    raid {
      ...RaidDetail
    }
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

export const ROLES_REQUIRED_UPDATE_MUTATION = gql`
  mutation RolesRequiredUpdateMutation(
    $insertRoles: [raids_roles_required_insert_input!]!
    $where: raids_roles_required_bool_exp!
  ) {
    insert_raids_roles_required(objects: $insertRoles) {
      returning {
        ...RolesRequired
      }
    }
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
    member_id
    raid {
      ...RaidDetail
    }
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

export const UPDATE_INVOICE_ADDRESS_QUERY = gql`
  mutation MyMutation($invoiceAddress: String!, $raidId: uuid!) {
    update_raids(
      where: { id: { _eq: $raidId } }
      _set: { invoice_address: $invoiceAddress }
    ) {
      returning {
        ...RaidDetail
      }
    }
  }
  ${RAID_DETAIL_FRAGMENT}
`;
