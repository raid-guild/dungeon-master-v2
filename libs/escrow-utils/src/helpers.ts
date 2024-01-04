import { getExplorerUrl } from '@raidguild/dm-utils';
import _ from 'lodash';
import { Hex } from 'viem';

import {
  nativeSymbols,
  NETWORK_CONFIG,
  RAIDGUILD_DAO,
  wrappedNativeToken,
} from './constants';

export const getResolverUrl = (chainId: number) => {
  const resolverAddress = NETWORK_CONFIG[chainId]
    ? _.first(_.keys(_.get(NETWORK_CONFIG[chainId], 'RESOLVERS')))
    : undefined;
  return `${getExplorerUrl(chainId)}/address/${resolverAddress}`;
};

export const getSpoilsUrl = (chainId: number, address: string) => {
  const spoilsAddress = chainId === 100 ? RAIDGUILD_DAO[chainId] : address;
  return `${getExplorerUrl(chainId)}/address/${spoilsAddress}`;
};

export const getAccountString = (account: string) => {
  const len = account.length;
  return `0x${account.slice(2, 3).toUpperCase()}...${account
    .slice(len - 3, len - 1)
    .toUpperCase()}`;
};

const resolverInfo = {
  100: NETWORK_CONFIG[100].RESOLVERS,
  1: NETWORK_CONFIG[1].RESOLVERS,
};

export const getResolverInfo = (chainId: number, resolver?: string) =>
  resolver ? resolverInfo[chainId]?.[resolver] : resolverInfo[chainId];

export const isKnownResolver = (chainId: number, resolver: Hex) =>
  !!_.get(getResolverInfo(chainId), _.toLower(resolver));

export const getResolverString = (chainId: number, resolver: string) => {
  const info = getResolverInfo(chainId, resolver);
  return info ? info.name : getAccountString(resolver);
};

export const getNativeTokenSymbol = (chainId: number) =>
  nativeSymbols[chainId] || nativeSymbols[4];

export const getWrappedNativeToken = (chainId: number) =>
  wrappedNativeToken[chainId] || wrappedNativeToken[4];

export const depositedMilestones = (deposited: bigint, amounts: number[]) => {
  let sum = BigInt(0);
  return amounts.map((a) => {
    sum += BigInt(a);
    return deposited >= sum;
  });
};

export const parseTokenAddress = (chainId: number, address: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(NETWORK_CONFIG[chainId].TOKENS)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((value as any).address === address.toLowerCase()) {
      return key;
    }
  }
  return undefined;
};

export const checkedAtIndex = (index: number, checked: boolean[]) =>
  _.map(checked, (_c, i) => i <= index);
