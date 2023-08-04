import { Chain, configureChains } from 'wagmi';
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  gnosis,
  goerli,
  sepolia,
} from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';

export const { chains, provider } = configureChains(
  [mainnet, gnosis, polygon, arbitrum, optimism, goerli, sepolia],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_RPC_KEY as string }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string }),
    jsonRpcProvider({
      rpc: (localChain: Chain) => ({
        http: localChain.rpcUrls.default.http[0],
      }),
    }),
  ]
);
