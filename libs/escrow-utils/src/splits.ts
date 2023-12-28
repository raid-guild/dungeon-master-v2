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

/**
 * Handles formatting a balance with fixed/padded decimals and rounding
 * @param balance string value returned from `formatUnits` from viem
 */
export const handleFormattedBalance = (balance: string) => {
  const localBalance = balance;

  if (localBalance.includes('.')) {
    const [whole, decimal] = localBalance.split('.');
    const decimalSet = new Set(decimal);
    if (
      (decimalSet.size === 1 && decimalSet.has('0')) ||
      // would catch 0.010101, assuming we're not so worried about decimals here
      (decimalSet.size === 2 && decimalSet.has('0') && decimalSet.has('1'))
    ) {
      return whole;
    }
    if (decimal.length > 4) {
      return `${whole}.${decimal.slice(0, 2)}`;
    }
    return localBalance;
  }

  return localBalance;
};
