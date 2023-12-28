import {
  client,
  RAID_BY_ID_QUERY,
  RAID_BY_V1_ID_QUERY,
} from '@raidguild/dm-graphql';
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (!session) {
    // TODO could check for specific roles
    return res.status(401).json('Unauthorized');
  }

  const v2Id = req.body.raidId.includes('-');
  let variables = {} as any;
  const v2IdVariable = { raidId: req.body.raidId };
  const v1IdVariable = { v1Id: req.body.raidId };
  if (v2Id) {
    variables = { ...v2IdVariable };
  } else {
    variables = { ...v1IdVariable };
  }
  console.log(v2Id, variables);

  try {
    const result = await client({}).request(
      v2Id ? RAID_BY_ID_QUERY : RAID_BY_V1_ID_QUERY,
      variables
    );

    const raid = _.first(_.get(result, 'raids'));
    return res.status(201).json(raid || null);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json('Internal server error');
  }
};

export default handler;
