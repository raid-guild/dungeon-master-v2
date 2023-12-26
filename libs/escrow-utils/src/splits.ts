/* eslint-disable import/prefer-default-export */

import { Hex } from 'viem';

export const splitsLink = (splitAddress: string, chainId: number) =>
  `https://app.splits.org/accounts/${splitAddress}/?chainId=${chainId}`;

export const SAFE_URL = 'https://app.safe.global';

export const SAFE_CHAIN_MAP: { [key: number]: string } = {
  1: 'eth',
  5: 'gor',
  10: 'oeth',
  100: 'gno',
  137: 'matic',
  424: 'pgn', // NOT ACTUALLY SUPPORTED YET
  // 8453: 'base',
  42161: 'arb1',
  // 42220: 'celo',
  11155111: 'sep',
};

export const safeUrl = (chainId: number, address: Hex | undefined) => {
  if (!chainId || !address) return '';
  return `${SAFE_URL}/home?safe=${SAFE_CHAIN_MAP[chainId]}:${address}`;
};
