/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { INVOICE_DETAILS_FRAGMENT } from './fragments';

// export const ALL_INVOICES_QUERY = gql`
//   query allInvoices {
//     raids(where: { invoice_address: { _is_null: false } }) {
//       id
//       invoice_address
//       name
//       start_date
//       end_date
//       consultation {
//         name
//       }
//     }
//   }
// `;

// export const ALL_RAIDS_QUERY = gql`
//   query fetchRaids {
//     raids {
//       id
//       v1_id
//     }
//   }
// `;

export const INVOICE_QUERY = gql`
  query GetInvoice($address: ID!) {
    invoice(id: $address) {
      ...InvoiceDetails
    }
  }
  ${INVOICE_DETAILS_FRAGMENT}
`;
