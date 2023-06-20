import axios from 'axios';
import { UPDATE_INVOICE_ADDRESS_QUERY } from '../../smartEscrow/graphql/queries';

const handler = async (req, res) => {
  const { method } = req;
  console.log('api post - invoice-create req: ', req);

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    try {
      const graphqlQuery = {
        // operationName: 'updateInvoiceAddress',
        query: UPDATE_INVOICE_ADDRESS_QUERY(
          req.body.raidId,
          req.body.invoiceAddress
        ),
        variables: {},
      };

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, graphqlQuery, {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      });

      res.status(201).json(data.data);
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal server error');
    }
  }
};

export default handler;
