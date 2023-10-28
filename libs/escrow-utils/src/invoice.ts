import { BigNumberish, Contract, utils } from 'ethers';

// TODO migrate to wagmi hooks

import { NETWORK_CONFIG } from './constants';

const getInvoiceFactoryAddress = (chainId: number) => {
  const invoiceFactory: { [key: number]: string } = {
    4: NETWORK_CONFIG[4].INVOICE_FACTORY,
    100: NETWORK_CONFIG[100].INVOICE_FACTORY,
    1: NETWORK_CONFIG[1].INVOICE_FACTORY,
    5: NETWORK_CONFIG[5].INVOICE_FACTORY,
  };

  return invoiceFactory[chainId] || invoiceFactory[4];
};

export const register = async (
  chainId: any,
  ethersProvider: any,
  recipient: any,
  amounts: any,
  data: any,
  type: any
) => {
  // Smart Invoice Factory Abi for create function
  const abi = new utils.Interface([
    'function create(address _recipient, uint256[] calldata _amounts, bytes _data, bytes32 _type) public',
  ]);
  // invoice factory address for smart invoice
  const factoryAddress = getInvoiceFactoryAddress(chainId);

  const contract = new Contract(factoryAddress, abi, ethersProvider);

  return contract['create'](recipient, amounts, data, type);
};

export const getResolutionRateFromFactory = async (
  chainId: number,
  ethersProvider: any,
  resolver: any
) => {
  if (!utils.isAddress(resolver)) return 20;
  try {
    const abi = new utils.Interface([
      'function resolutionRates(address resolver) public view returns (uint256)',
    ]);
    const contract = new Contract(
      getInvoiceFactoryAddress(chainId),
      abi,
      ethersProvider
    );

    const resolutionRate = Number(await contract['resolutionRates'](resolver));
    return resolutionRate > 0 ? resolutionRate : 20;
  } catch (resolutionRateError) {
    console.error(resolutionRateError);
    return 20;
  }
};

export const awaitInvoiceAddress = async (ethersProvider: any, tx: any) => {
  await tx.wait(1);
  const abi = new utils.Interface([
    'event LogNewInvoice(uint256 indexed index, address indexed invoice, uint256[] amounts, bytes32 invoiceType, uint256 version)',
  ]);

  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = receipt.logs.find((e: any) => e.topics[0] === eventTopic);
  if (event) {
    const decodedLog = abi.decodeEventLog(
      eventFragment,
      event.data,
      event.topics
    );
    return decodedLog['invoice'];
  }
  return '';
};

export const release = async (ethersProvider: any, address: string) => {
  const abi = new utils.Interface(['function release() public']);
  const contract = new Contract(address, abi, ethersProvider);
  return contract['release']();
};

export const withdraw = async (ethersProvider: any, address: string) => {
  const abi = new utils.Interface(['function withdraw() public']);
  const contract = new Contract(address, abi, ethersProvider);
  return contract['withdraw']();
};

export const lock = async (
  ethersProvider: any,
  address: string,
  detailsHash: string // 32 bits hex
) => {
  const abi = new utils.Interface(['function lock(bytes32 details) external']);
  const contract = new Contract(address, abi, ethersProvider);
  return contract['lock'](detailsHash);
};

export const resolve = async (
  ethersProvider: any,
  address: string,
  clientAward: number,
  providerAward: BigNumberish,
  detailsHash: string // 32 bits hex
) => {
  const abi = new utils.Interface([
    'function resolve(uint256 clientAward, uint256 providerAward, bytes32 details) external',
  ]);
  const contract = new Contract(address, abi, ethersProvider);
  return contract['resolve'](clientAward, providerAward, detailsHash);
};
