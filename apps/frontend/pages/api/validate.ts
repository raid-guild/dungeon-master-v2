import { RAID_BY_ID_QUERY, RAID_BY_V1_ID_QUERY } from '@raidguild/dm-graphql';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';

// TODO use gql request & native client

const DM_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || '';
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }
  // TODO could check for specific roles
  if (!session) {
    return res.status(401).json('Unauthorized');
  }

  const v2Id = req.body.raidId.includes('-');
  const variables = {} as any;
  if (v2Id) {
    variables.raidId = req.body.raidId;
  } else {
    variables.v1Id = req.body.raidId;
  }

  try {
    const graphqlQuery = {
      operationName: 'validateRaidId',
      query: v2Id ? RAID_BY_ID_QUERY : RAID_BY_V1_ID_QUERY,
      variables,
    };

    const { data } = await axios.post(`${DM_ENDPOINT}`, graphqlQuery, {
      headers: {
        'x-hasura-admin-secret': HASURA_SECRET,
      },
    });

    res.status(201).json(data.data.raids?.[0] ? data.data.raids[0] : null);
  } catch (err) {
    console.error(err);
    res.status(500).json('Internal server error');
  }
};

export default handler;
