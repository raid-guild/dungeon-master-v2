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

export const getInvoice = async (chainId, queryAddress) => {
  const address = isAddress(queryAddress);
  if (!address) return null;

  const { data, error } = await clients[chainId]
    .query(invoiceQuery, { address })
    .toPromise();
  if (!data) {
    if (error) {
      console.log(error);
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
