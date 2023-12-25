import { client, UPDATE_INVOICE_ADDRESS_QUERY } from '@raidguild/dm-graphql';
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

  const { raidId, invoiceAddress } = _.pick(body, ['raidId', 'invoiceAddress']);

  try {
    // TODO move to helper
    const result: any = await client({}).request(UPDATE_INVOICE_ADDRESS_QUERY, {
      raidId,
      invoiceAddress: _.toLower(invoiceAddress),
    });

    return res.status(201).json(result?.update_raids_by_pk?.returning);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json('Internal server error');
  }
};

export default handler;
