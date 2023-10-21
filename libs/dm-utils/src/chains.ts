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
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
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

export const { chains, provider } = configureChains(supportedChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_RPC_KEY as string }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
  jsonRpcProvider({
    rpc: (localChain: Chain) => ({
      http: localChain.rpcUrls.default.http[0],
    }),
  }),
]);
