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

const data: any = configureChains(supportedChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_RPC_KEY as string }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
  publicProvider(),
]);

const chains: Chain[] = data?.chains;
const publicClient = data?.publicClient;

export { chains, publicClient };
