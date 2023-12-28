/* eslint-disable import/prefer-default-export */
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
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
import {
  Config,
  createConfig,
  PublicClient,
  WebSocketPublicClient,
} from 'wagmi';

import { chains, publicClient } from './chains';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '';

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',

    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains, shimDisconnect: false, projectId }),
      walletConnectWallet({ chains, projectId }),
      ledgerWallet({ chains, projectId }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      rainbowWallet({ chains, projectId }),
      coinbaseWallet({ chains, appName: 'Dungeon Master' }),
      argentWallet({ chains, projectId }),
      braveWallet({ chains }),
    ],
  },
]);

export const wagmiConfig: Config<PublicClient, WebSocketPublicClient> =
  createConfig({
    publicClient,
    connectors,
  });
