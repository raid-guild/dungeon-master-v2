import { gql } from 'graphql-request';
import _ from 'lodash';
import { getAddress } from 'viem';

import { client } from './client';
import { InvoiceDetails } from './fragments';

const isAddress = (value: string) => {
  try {
    return _.toLower(getAddress(value));
  } catch {
    return false;
  }
};

const invoiceQuery = gql`
  query GetInvoice($address: ID!) {
    invoice(id: $address) {
      ...InvoiceDetails
    }
  }
  ${InvoiceDetails}
`;

// This fetches data on the invoice from The Graph
export const getInvoice = async (chainId: number, queryAddress: string) => {
  const address = isAddress(queryAddress);
  if (!address) return null;

  try {
    const result = await client(chainId).request(invoiceQuery, {
      address,
    });

    return _.get(result, 'data.invoice');
  } catch (err) {
    console.error(err);
    return null;
  }
};
