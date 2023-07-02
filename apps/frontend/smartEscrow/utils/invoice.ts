import { Contract, utils } from 'ethers';

import { NETWORK_CONFIG } from './constants';

const getInvoiceFactoryAddress = (chainId: number) => {
  const invoiceFactory = {
    4: NETWORK_CONFIG[4].INVOICE_FACTORY,
    100: NETWORK_CONFIG[100].INVOICE_FACTORY,
    1: NETWORK_CONFIG[1].INVOICE_FACTORY,
    5: NETWORK_CONFIG[5].INVOICE_FACTORY,
  };

  return invoiceFactory[chainId] || invoiceFactory[4];
};

// chainId,
// ethersProvider,
// paymentsInWei,
// data,
// type
export const register = async (
  chainId,
  ethersProvider,
  recipient,
  amounts,
  data,
  type
) => {
  // debugger;
  console.log(
    'calling register with params: ',
    chainId,
    ethersProvider,
    recipient,
    amounts,
    data,
    type
  );
  // Smart Invoice Factory Abi for create function
  const abi = new utils.Interface([
    'function create(address _recipient, uint256[] calldata _amounts, bytes _data, bytes32 _type) public',
  ]);
  console.log(
    'register: getInvoiceFactoryAddress(chainId): chainId: ',
    getInvoiceFactoryAddress(chainId),
    chainId
  );
  // invoice factory address for smart invoice
  const factoryAddress = getInvoiceFactoryAddress(chainId);

  const contract = new Contract(factoryAddress, abi, ethersProvider);

  console.log('calling create with params: ', recipient, amounts, data, type);
  return contract.create(recipient, amounts, data, type);
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

    const resolutionRate = Number(await contract.resolutionRates(resolver));
    return resolutionRate > 0 ? resolutionRate : 20;
  } catch (resolutionRateError) {
    console.log(resolutionRateError);
    return 20;
  }
};

export const awaitInvoiceAddress = async (ethersProvider, tx) => {
  await tx.wait(1);
  const abi = new utils.Interface([
    'event LogNewInvoice(uint256 indexed index, address indexed invoice, uint256[] amounts, bytes32 invoiceType, uint256 version)',
  ]);

  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  console.log('awaitInvoiceAddress receipt', receipt);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = receipt.logs.find((e) => e.topics[0] === eventTopic);
  console.log(
    'awaitInvoiceAddress event eventFragment eventTopic',
    event,
    eventFragment,
    eventTopic
  );
  if (event) {
    const decodedLog = abi.decodeEventLog(
      eventFragment,
      event.data,
      event.topics
    );
    console.log('event found: ', event, 'decodedLog: ', decodedLog);
    return decodedLog.invoice;
  }
  return '';
};

export const awaitSpoilsWithdrawn = async (ethersProvider, tx) => {
  await tx.wait(1);
  const abi = new utils.Interface([
    'event Withdraw(address indexed token, uint256 parentShare, uint256 childShare)',
  ]);
  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = receipt.logs.find((e) => e.topics[0] === eventTopic);
  if (event) {
    const decodedLog = abi.decodeEventLog(
      eventFragment,
      event.data,
      event.topics
    );
    return decodedLog;
  }
  return '';
};

export const release = async (ethersProvider, address) => {
  const abi = new utils.Interface(['function release() public']);
  const contract = new Contract(address, abi, ethersProvider);
  return contract.release();
};

export const withdraw = async (ethersProvider, address) => {
  const abi = new utils.Interface(['function withdraw() public']);
  const contract = new Contract(address, abi, ethersProvider);
  return contract.withdraw();
};

export const lock = async (
  ethersProvider,
  address,
  detailsHash // 32 bits hex
) => {
  const abi = new utils.Interface(['function lock(bytes32 details) external']);
  const contract = new Contract(address, abi, ethersProvider);
  return contract.lock(detailsHash);
};

export const resolve = async (
  ethersProvider,
  address,
  clientAward,
  providerAward,
  detailsHash // 32 bits hex
) => {
  const abi = new utils.Interface([
    'function resolve(uint256 clientAward, uint256 providerAward, bytes32 details) external',
  ]);
  const contract = new Contract(address, abi, ethersProvider);
  return contract.resolve(clientAward, providerAward, detailsHash);
};