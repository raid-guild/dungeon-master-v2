/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

import { INVOICE_DETAILS_FRAGMENT } from './fragments';

export const INVOICE_QUERY = gql`
  query GetInvoice($address: ID!) {
    invoice(id: $address) {
      ...InvoiceDetails
    }
  }
  ${INVOICE_DETAILS_FRAGMENT}
`;

export const V2_INVOICE_QUERY = gql`
  query GetInvoice($address: ID!) {
    invoice(id: $address) {
      ...InvoiceDetails
      providerReceiver
    }
  }
  ${INVOICE_DETAILS_FRAGMENT}
`;
