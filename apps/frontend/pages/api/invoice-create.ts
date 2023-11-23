import axios from 'axios';
import { UPDATE_INVOICE_ADDRESS_QUERY } from '@raidguild/dm-graphql';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// TODO gql-request & native client

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);
  console.log(session);

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }
  // TODO could check for specific roles
  if (!session) {
    return res.status(401).json('Unauthorized');
  }

  try {
    const graphqlQuery = {
      // operationName: 'updateInvoiceAddress',
      query: UPDATE_INVOICE_ADDRESS_QUERY(
        req.body.raidId,
        req.body.invoiceAddress
      ),
      variables: {},
    };

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}`,
      graphqlQuery,
      {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      }
    );

    return res.status(201).json(data.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json('Internal server error');
  }
};

export default handler;
