import _ from 'lodash';
import { Chain, configureChains } from 'wagmi';
import {
  arbitrum,
  gnosis,
  goerli,
  hardhat,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const customGnosis = {
  ...gnosis,
  hasIcon: true,
  iconUrl: '/icons/gnosis-light.png',
  iconBackground: 'none',
};

const orderedChains = [
  1, // mainnet
  100, // customGnosis
  137, // polygon
  42151, // arbitrum
  10, // optimism
  5, // goerli
  11155111, // sepolia
];

const chainsList: { [key: number]: Chain } = {
  100: customGnosis,
  137: polygon,
  42151: arbitrum,
  10: optimism,
  1: mainnet,
  5: goerli,
  11155111: sepolia,
};
if (process.env.NODE_ENV === 'development') {
  chainsList[31337] = hardhat;
}
export const chainsMap = (chainId: number) => chainsList[chainId];
export const chainIdToIconMap = (chainId: number) => {
  switch (chainId) {
    case optimism.id:
      return '/icons/optimism.png';
    case gnosis.id:
      return '/icons/gnosis-light.png';
    default:
      return '';
  }
};
export const networkToIdMap = (network: string) => {
  switch (network) {
    case 'optimism':
      return optimism.id;
    case 'gnosis':
      return gnosis.id;
    default:
      return 0;
  }
};

const data = configureChains(
  _.map(orderedChains, (id: number) => chainsMap(id)),
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_RPC_KEY as string }),
    publicProvider(),
  ]
);

const { chains, publicClient } = _.pick(data, ['chains', 'publicClient']);

export const getExplorerUrl = (chainId: number) =>
  chainsMap(chainId)?.blockExplorers?.etherscan?.url ||
  chainsMap(chainId)?.blockExplorers?.default?.url;

export const getTxLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/tx/${hash}`;

export const getAddressLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/address/${hash}`;

export { chains, publicClient };
