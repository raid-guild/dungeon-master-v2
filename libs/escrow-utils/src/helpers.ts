import { getExplorerUrl } from '@raidguild/dm-utils';
import { NETWORK_CONFIG, nativeSymbols, wrappedNativeToken } from './constants';

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

export const getAccountString = (account: string) => {
  const len = account.length;
  return `0x${account.slice(2, 3).toUpperCase()}...${account
    .slice(len - 3, len - 1)
    .toUpperCase()}`;
};

export const getNativeTokenSymbol = (chainId: number) =>
  nativeSymbols[chainId] || nativeSymbols[4];

export const getWrappedNativeToken = (chainId: number) =>
  wrappedNativeToken[chainId] || wrappedNativeToken[4];

export const getCheckedStatus = (deposited: bigint, amounts: number[]) => {
  let sum = BigInt(0);
  return amounts.map((a) => {
    sum = sum + BigInt(a);
    return deposited >= sum;
  });
};

export const parseTokenAddress = (chainId: number, address: string) => {
  for (const [key, value] of Object.entries(
    NETWORK_CONFIG[chainId]['TOKENS']
  )) {
    if ((value as any)['address'] === address.toLowerCase()) {
      return key;
    }
  }
  return undefined;
};

export const checkedAtIndex = (index: number, checked: boolean[]) => {
  return checked.map((_c, i) => i <= index);
};
