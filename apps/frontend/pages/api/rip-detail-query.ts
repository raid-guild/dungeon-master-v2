import axios from 'axios';
import { RIP_DETAIL_QUERY } from '@raidguild/dm-graphql';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const GITHUB_API_URL = process.env.GITHUB_API_URL || '';
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json('Unauthorized');
  }

  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    try {
      const graphqlQuery = {
        query: RIP_DETAIL_QUERY,
        variables: {
          repository_owner: 'raid-guild',
          repository_name: 'RIPs',
          project_number: 1,
          project_columns: 6,
          cards_to_get: 50,
        },
      };

      const { data } = await axios.post(`${GITHUB_API_URL}`, graphqlQuery, {
        headers: {
          Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        },
      });
      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal server error');
    }
  }
};

export default handler;
