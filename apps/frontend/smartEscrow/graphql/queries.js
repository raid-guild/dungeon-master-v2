import gql from "fake-tag";

export const ALL_INVOICES_QUERY = () => `query allInvoices { 
    raids(where: {invoice_address: {_is_null: false}}) {
      id
      invoice_address
      name
      start_date
      end_date
      consultation {
        name
      }
    }}`;

export const ALL_RAIDS_QUERY = gql`query fetchRaids { raids { id, v1_id } }`;

const RAID_DETAILS_FRAGMENT = gql`
  fragment RaidDetails on raids {
    id
    v1_id
    invoice_address
    name
    start_date
    end_date
    consultation {
      consultations_contacts {
        contact {
          name
        }
      }
    }
  }
`;

export const RAID_BY_ID_QUERY = gql`
  query validateRaidId($raidId: uuid) { 
    raids(where: {id: {_eq: $raidId}}) {
      ...RaidDetails
    }
  }
  ${RAID_DETAILS_FRAGMENT}
`;

export const RAID_BY_V1_ID_QUERY = gql`
  query validateRaidId($v1Id: String) { 
    raids(where: {v1_id: {_eq: $v1Id}}) {
      ...RaidDetails
    }
  }
  ${RAID_DETAILS_FRAGMENT}
`;

export const UPDATE_INVOICE_ADDRESS_QUERY = (
  raidId,
  invoice_address
) => `
  mutation MyMutation {
    update_raids(where: {id: {_eq: "${raidId}"}}, _set: {invoice_address: "${invoice_address}"}) {
      returning {
        ...RaidDetails
      }
    }
  }
  ${RAID_DETAILS_FRAGMENT}
`;

// 0x6085adf86110468945e6f109d1f6b7116a94d9f2;
