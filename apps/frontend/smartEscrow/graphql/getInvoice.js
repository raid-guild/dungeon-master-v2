import gql from 'fake-tag';
import { utils } from 'ethers';

import { clients } from './client';
import { InvoiceDetails } from './fragments';

const isAddress = value => {
  try {
    return utils.getAddress(value).toLowerCase();
  } catch {
    return false;
  }
};

const invoiceQuery = gql`
  query GetInvoice($address: ID!) {
    invoice(id: $address) {
      ...InvoiceDetails
    }
  }
  ${InvoiceDetails}
`;

// This fetches data on the invoice from The Graph
export const getInvoice = async (chainId, queryAddress) => {
  const address = isAddress(queryAddress);
  if (!address) return null;
  console.log('getInvoice clients[chainId], chainId, queryAddress', clients[chainId], chainId, queryAddress);

  const { data, error } = await clients[chainId]
    .query(invoiceQuery, { address })
    .toPromise();
  console.log('getInvoice result: data, error: ', data, error);
  if (!data) {
    if (error) {
      console.error(error);
    }
    return null;
  }

  return data.invoice;
};

// export const getInvoice = async (chainId, queryAddress, tryAll = false) => {
//   let invoice = await getInvoiceFromchainId(chainId, queryAddress);
//   if (!invoice && tryAll) {
//     const otherChainIds = new Set(SUPPORTED_NETWORKS);
//     otherChainIds.delete(chainId);
//     for (const chain of otherChainIds) {
//       // eslint-ignore-next-line no-await-in-loop
//       invoice = await getInvoiceFromchainId(chain, queryAddress);
//       if (invoice) {
//         break;
//       }
//     }
//   }
//   return invoice;
// };
