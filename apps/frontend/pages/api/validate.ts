import axios from 'axios';
import { RAID_BY_ID_QUERY, RAID_BY_V1_ID_QUERY } from '@raidguild/dm-graphql';

const DM_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || '';
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const handler = async (req, res) => {
  const { method } = req;
  console.log('inside validate api handler, req.body: ', req.body);

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
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
  }
};

export default handler;
