/* eslint-disable import/prefer-default-export */
// TODO migrate to wagmi hooks

import { Hex } from 'viem';

import { NETWORK_CONFIG } from './constants';

export const invoiceUrl = (chainId: number, address: Hex | undefined) => {
  if (!chainId || !address) return '';
  return `https://app.smartinvoice.xyz/invoice/0x${chainId.toString(
    16
  )}/${address}`;
};

export const getInvoiceFactoryAddress = (chainId: number) => {
  const invoiceFactory: { [key: number]: string } = {
    4: NETWORK_CONFIG[4].INVOICE_FACTORY,
    100: NETWORK_CONFIG[100].INVOICE_FACTORY,
    1: NETWORK_CONFIG[1].INVOICE_FACTORY,
    5: NETWORK_CONFIG[5].INVOICE_FACTORY,
  };

  return invoiceFactory[chainId] || invoiceFactory[4];
};

//     'function create(address _recipient, uint256[] calldata _amounts, bytes _data, bytes32 _type) public',

//      factory
//       'function resolutionRates(address resolver) public view returns (uint256)',

// export const awaitInvoiceAddress = async (ethersProvider: any, tx: any) => {
//   await tx.wait(1);
//   const abi = new utils.Interface([
//     'event LogNewInvoice(uint256 indexed index, address indexed invoice, uint256[] amounts, bytes32 invoiceType, uint256 version)',
//   ]);

//   const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
//   const eventFragment = abi.events[Object.keys(abi.events)[0]];
//   const eventTopic = abi.getEventTopic(eventFragment);
//   const event = receipt.logs.find((e: any) => e.topics[0] === eventTopic);
//   if (event) {
//     const decodedLog = abi.decodeEventLog(
//       eventFragment,
//       event.data,
//       event.topics
//     );
//     return decodedLog['invoice'];
//   }
//   return '';
// };

//   return contract['release']();
//   return contract['withdraw']();
//   return contract['lock'](detailsHash);
//   return contract['resolve'](clientAward, providerAward, detailsHash);
// };
