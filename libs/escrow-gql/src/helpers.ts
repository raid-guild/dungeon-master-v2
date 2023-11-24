/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { isAddress } from 'viem';

import { client } from './client';
import { INVOICE_QUERY } from './queries';

// This fetches data on the invoice from The Graph
export const getInvoice = async (chainId: number, address: string) => {
  if (!isAddress(address)) return null;

  try {
    const result = await client(chainId).request(INVOICE_QUERY, {
      address,
    });

    return _.get(result, 'invoice');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return null;
  }
};
