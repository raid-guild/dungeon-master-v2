import axios from 'axios';
import { RIP_DETAIL_QUERY } from '@raidguild/dm-graphql';

const API_URL = process.env.GITHUB_API_URL || '';
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const handler = async (req, res) => {
  // TODO use getSession from NextAuth

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

      const { data } = await axios.post(`${API_URL}`, graphqlQuery, {
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
