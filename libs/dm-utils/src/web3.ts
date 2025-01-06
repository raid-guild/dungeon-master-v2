/* eslint-disable import/prefer-default-export */
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { getPublicClient } from '@wagmi/core';
import { http, Transport } from 'viem';
import { fallback } from 'wagmi';

import {
  alchemyNetworkName,
  infuraNetworkName,
  SUPPORTED_CHAINS,
  SupportedChain,
  SupportedChainId,
} from './chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '';

type _transports = Record<SupportedChainId, Transport>;

const transports: _transports = SUPPORTED_CHAINS.reduce(
  (acc: _transports, chain: SupportedChain) => {
    const list = [http()];

    const infuraNetwork = infuraNetworkName[chain.id];
    const infuraUrl =
      infuraNetwork && process.env.NEXT_PUBLIC_RPC_KEY
        ? `https://${infuraNetwork}.infura.io/v3/${
            process.env.NEXT_PUBLIC_RPC_KEY as string
          }`
        : undefined;
    if (infuraUrl) list.push(http(infuraUrl));

    const alchemyNetwork = alchemyNetworkName[chain.id];
    const alchemyUrl =
      alchemyNetwork && process.env.NEXT_PUBLIC_RPC_KEY
        ? `https://${alchemyNetwork}.g.alchemy.com/v2/${
            process.env.NEXT_PUBLIC_ALCHEMY_ID as string
          }`
        : undefined;
    if (alchemyUrl) list.push(http(alchemyUrl));

    return {
      ...acc,
      [chain.id]: fallback(list.reverse()),
    };
  },
  {} as _transports
);

const wagmiConfig = getDefaultConfig({
  ssr: true,
  appName: 'Dungeon Master',
  projectId,
  chains: SUPPORTED_CHAINS,
  transports,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        argentWallet,
        braveWallet,
        coinbaseWallet,
        injectedWallet,
        ledgerWallet,
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
});

const publicClient = ({ chainId }: { chainId: number }) =>
  getPublicClient(wagmiConfig, { chainId });

export { publicClient, wagmiConfig };
