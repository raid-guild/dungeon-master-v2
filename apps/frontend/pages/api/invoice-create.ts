import {
  client,
  INSERT_INVOICE_MUTATION,
  UPDATE_INVOICE_ID_QUERY,
} from '@raidguild/dm-graphql';
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';

// TODO gql-request & native client

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const session = await getServerSession(req, res, authOptions);

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }
  // TODO could check for specific roles
  if (!session) {
    return res.status(401).json('Unauthorized');
  }

  const { chainId, raidId, invoiceAddress } = _.pick(body, [
    'chainId',
    'raidId',
    'invoiceAddress',
  ]);

  try {
    const invoiceInsertResult: any = await client({}).request(
      INSERT_INVOICE_MUTATION,
      {
        invoice: {
          chain_id: chainId,
          invoice_address: _.toLower(invoiceAddress),
        },
      }
    );

    if (!invoiceInsertResult?.insert_invoices_one) {
      return res.status(500).json('Failed to create invoice');
    }

    // TODO move to helper
    const raidUpdateResult: any = await client({}).request(
      UPDATE_INVOICE_ID_QUERY,
      {
        raidId,
        invoiceId: invoiceInsertResult.insert_invoices_one.id,
        invoiceAddress: _.toLower(invoiceAddress),
      }
    );

    return res
      .status(201)
      .json(raidUpdateResult?.update_raids_by_pk?.returning);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json('Internal server error');
  }
};

export default handler;
