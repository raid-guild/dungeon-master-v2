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
    const result = await client(chainId).request(V2_INVOICE_QUERY, {
      address: _.toLower(address),
    });
    const invoice = _.get(result, 'invoice');
    return invoice || null;
  } catch (err) {
    // eslint-disable-next-line no-console
    // try v1 client
    // TODO: FIX V1 CLIENT
    console.log('trying v1 client', err);
    const result = v1Client.request(INVOICE_QUERY, {
      address: _.toLower(address),
    });

    const invoice = _.first(_.compact(_.map(result as any, 'invoice'))); // NOT SURE IF IT WORKS ANYMORE, NEED V1 CLIENT SUBGRAPH MIGRATED TO STUDIO URL
    return invoice || null;
  }
};
