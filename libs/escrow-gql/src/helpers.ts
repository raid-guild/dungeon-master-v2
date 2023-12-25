/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { isAddress } from 'viem';

import { client, v1Client } from './client';
import { INVOICE_QUERY, V2_INVOICE_QUERY } from './queries';

// also fetch the old subgraph for now

// This fetches data on the invoice from The Graph
export const getInvoice = async (chainId: number, address: string) => {
  if (!isAddress(address)) return null;

  try {
    const promises = [
      client(chainId).request(V2_INVOICE_QUERY, {
        address: _.toLower(address),
      }),
      v1Client.request(INVOICE_QUERY, {
        address: _.toLower(address),
      }),
    ];

    const result = await Promise.all(promises);
    console.log(result);
    const invoice = _.first(_.compact(_.map(result, 'invoice')));

    return invoice || null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return null;
  }
};
