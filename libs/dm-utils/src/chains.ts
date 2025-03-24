import { Chain } from 'viem';
import {
  arbitrum,
  gnosis,
  goerli,
  hardhat,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'viem/chains';

const chains: readonly Chain[] = [
  mainnet,
  gnosis,
  polygon,
  arbitrum,
  optimism,
  sepolia,
  goerli,
] as const;

export const chainsList: Record<number, Chain> = {
  100: gnosis,
  137: polygon,
  42151: arbitrum,
  10: optimism,
  1: mainnet,
  11155111: sepolia,
  5: goerli,
};

export const SUPPORTED_CHAIN_IDS = chains.map((chain) => chain.id);
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number];
export type SupportedChain = (typeof chains)[number];
export const SUPPORTED_CHAINS = chains as [SupportedChain, ...SupportedChain[]];

export const infuraNetworkName: Record<SupportedChainId, string | undefined> = {
  [mainnet.id]: 'mainnet',
  [polygon.id]: 'polygon-mainnet',
  [arbitrum.id]: 'arbitrum-mainnet',
  [optimism.id]: 'optimism-mainnet',
  [sepolia.id]: 'sepolia',
};

export const alchemyNetworkName: Record<SupportedChainId, string | undefined> =
  {
    [mainnet.id]: 'eth-mainnet',
    [polygon.id]: 'polygon-mainnet',
    [arbitrum.id]: 'arb-mainnet',
    [optimism.id]: 'opt-mainnet',
    [sepolia.id]: 'eth-sepolia',
    [gnosis.id]: 'gnosis-mainnet',
  };

if (process.env.NODE_ENV === 'development') {
  (chains as Chain[]).push(hardhat);
}

export const chainsMap = (chainId: number): Chain | undefined =>
  chainsList[chainId];

export const chainIdToIconMap = (chainId: number): string => {
  switch (chainId) {
    case optimism.id:
      return '/icons/optimism.png';
    case gnosis.id:
      return '/icons/gnosis-light.png';
    default:
      return '';
  }
};

export const networkToIdMap = (network: string): number => {
  switch (network) {
    case 'optimism':
      return optimism.id;
    case 'gnosis':
      return gnosis.id;
    default:
      return 0;
  }
};

export const getExplorerUrl = (chainId: number) =>
  chainsMap(chainId)?.blockExplorers?.etherscan?.url ||
  chainsMap(chainId)?.blockExplorers?.default?.url;

export const getTxLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/tx/${hash}`;

export const getAddressLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/address/${hash}`;
