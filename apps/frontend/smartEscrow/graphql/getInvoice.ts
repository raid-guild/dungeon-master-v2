// @ts-ignore
import gql from 'fake-tag';
import { utils } from 'ethers';

import { clients } from './client';
import { InvoiceDetails } from './fragments';

const isAddress = (value: string) => {
  try {
    return utils.getAddress(value).toLowerCase();
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

  const { data, error } = await clients[chainId]
    .query(invoiceQuery, { address })
    .toPromise();

  if (!data) {
    if (error) {
      console.error(error);
    }
    return null;
  }

  return data.invoice;
};
