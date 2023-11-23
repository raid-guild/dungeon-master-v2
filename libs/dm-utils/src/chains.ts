import { Chain, configureChains } from 'wagmi';
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  gnosis,
  goerli,
  sepolia,
  hardhat,
} from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import _ from 'lodash';

let chainsList: { [key: number]: Chain } = {
  1: mainnet,
  100: gnosis,
  137: polygon,
  42151: arbitrum,
  10: optimism,
  5: goerli,
  1115555111: sepolia,
};
if (process.env.NODE_ENV === 'development') {
  chainsList[31337] = hardhat;
}
const chainsMap = (chainId: number) => {
  return chainsList[chainId];
};

const data: any = configureChains(_.values(chainsList), [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_RPC_KEY as string }),
  publicProvider(),
]);

const { chains, publicClient } = _.pick(data, ['chains', 'publicClient']);

export const getExplorerUrl = (chainId: number) =>
  chainsMap(chainId)?.blockExplorers?.etherscan?.url ||
  chainsMap(chainId)?.blockExplorers?.default?.url;

export const getTxLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/tx/${hash}`;

export const getAddressLink = (chainId: number, hash: string) =>
  `${getExplorerUrl(chainId)}/address/${hash}`;

export { chains, publicClient };
