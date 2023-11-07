/* eslint-disable import/prefer-default-export */
import { createConfig, WagmiConfig } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  argentWallet,
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';

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

export const wagmiConfig: any = createConfig({
  publicClient,
  connectors,
  // turn off autoConnect in development
  autoConnect: true,
});
