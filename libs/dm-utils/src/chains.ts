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
import { createPublicClient, http } from 'viem';

let supportedChains = [
  mainnet,
  gnosis,
  polygon,
  arbitrum,
  optimism,
  goerli,
  sepolia,
];
if (process.env.NODE_ENV === 'development') {
  supportedChains = _.concat(supportedChains, [hardhat]);
}
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const { chains, publicClient } = configureChains(supportedChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_RPC_KEY as string }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
  publicProvider(),
]);
