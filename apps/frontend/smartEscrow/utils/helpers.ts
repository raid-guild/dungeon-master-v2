import { BigNumber } from 'ethers';

import {
  explorerUrls,
  networkLabels,
  NETWORK_CONFIG,
  nativeSymbols,
  wrappedNativeToken
} from './constants';

export const copyToClipboard = (value: string) => {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

export const getExplorerUrl = (chainId: number) =>
  explorerUrls[chainId] || explorerUrls[4];

export const getTxLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/tx/${hash}`;

export const getAddressLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/address/${hash}`;

export const getResolverUrl = (chainId: number) => {
  const resolverAddress = NETWORK_CONFIG[chainId]
    ? NETWORK_CONFIG[chainId]['RESOLVERS']['LexDAO']['address']
    : undefined;
  return `${getExplorerUrl(chainId)}/address/${resolverAddress}`;
};

export const getSpoilsUrl = (chainId: number, address: string) => {
  const spoilsAddress = chainId === 100 ? NETWORK_CONFIG['RG_XDAI'] : address;
  return `${getExplorerUrl(chainId)}/address/${spoilsAddress}`;
};

export const getNetworkLabel = (chainId: number) =>
  networkLabels[chainId] || 'unknown';

export const getAccountString = (account: string) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};

export const getNativeTokenSymbol = (chainId: number) =>
  nativeSymbols[chainId] || nativeSymbols[4];

export const getWrappedNativeToken = (chainId: number) =>
  wrappedNativeToken[chainId] || wrappedNativeToken[4];

export const getCheckedStatus = (deposited: BigNumber, amounts: number[]) => {
  let sum = BigNumber.from(0);
  return amounts.map((a) => {
    sum = sum.add(a);
    return deposited.gte(sum);
  });
};

export const parseTokenAddress = (chainId: number, address: string) => {
  for (const [key, value] of Object.entries(
    NETWORK_CONFIG[chainId]['TOKENS']
  )) {
    if (value['address'] === address.toLowerCase()) {
      return key;
    }
  }
};

export const checkedAtIndex = (index: number, checked: number[]) => {
  return checked.map((_c, i) => i <= index);
};
