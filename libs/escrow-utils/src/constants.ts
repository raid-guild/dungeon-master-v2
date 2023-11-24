import _ from 'lodash';

import LexDAOLogo from './assets/lex-dao.png';

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

export const IPFS_ENDPOINT = 'https://ipfs.infura.io';
export const BOX_ENDPOINT = 'https://ipfs.3box.io';

export const NETWORK_CONFIG: any = {
  // RaidGuild DAO treasury address V3
  RG_XDAI: _.toLower('0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986'),
  // RaidGuild Ethereum Mainnet multisig
  RG_MULTISIG: _.toLower('0x3C3692681cD1c0F42FA68A2521719Cc24CEc3AF3'),
  100: {
    SUBGRAPH: 'geovgy/v1-gnosis-chain-smart-invoice',
    INVOICE_FACTORY: _.toLower('0xdDd96D43b0B2Ca179DCefA58e71798d0ce56c9c8'),
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'
    ),
    TOKENS: {
      WXDAI: {
        decimals: 18,
        address: _.toLower('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'),
      },
      WETH: {
        decimals: 18,
        address: _.toLower('0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'),
      },
    },
    RESOLVERS: {
      LexDAO: {
        address: _.toLower('0x153Fbf5da827903e030Dc317C4031755D74D508a'),
        logoUrl: LexDAOLogo,
        termsUrl:
          'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
      },
    },
  },
  1: {
    SUBGRAPH: 'psparacino/v1-mainnet-smart-invoices',
    INVOICE_FACTORY: _.toLower('0x5E14cF595e18F91170009946205f8BBa21b323ca'),
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    ),
    TOKENS: {
      WETH: {
        decimals: 18,
        address: _.toLower('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
      },
      DAI: {
        decimals: 18,
        address: _.toLower('0x6B175474E89094C44Da98b954EedeAC495271d0F'),
      },
    },
    RESOLVERS: {
      LexDAO: {
        address: _.toLower('0x01b92e2c0d06325089c6fd53c98a214f5c75b2ac'),
        logoUrl: LexDAOLogo,
        termsUrl:
          'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
      },
    },
  },
  5: {
    SUBGRAPH: 'geovgy/v1-goerli-smart-invoice',
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    ),
    INVOICE_FACTORY: _.toLower('0x546adED0B0179d550e87cf909939a1207Fd26fB7'),
    TOKENS: {
      WETH: {
        decimals: 18,
        address: _.toLower('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'),
      },
      DAI: {
        decimals: 18,
        address: _.toLower('0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'),
      },
      TEST: {
        decimals: 18,
        address: _.toLower('0x982e00B16c313E979C0947b85230907Fce45d50e'),
      },
    },
    RESOLVERS: {
      LexDAO: {
        address: _.toLower('0x1206b51217271FC3ffCa57d0678121983ce0390E'),
        logoUrl: LexDAOLogo,
        termsUrl:
          'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
      },
    },
  },
};

export const nativeSymbols: { [key: number]: string } = {
  1: 'ETH',
  5: 'ETH',
  100: 'xDAI',
};

export const wrappedNativeToken: { [key: number]: string } = {
  1: NETWORK_CONFIG[1].WRAPPED_NATIVE_TOKEN,
  5: NETWORK_CONFIG[5].WRAPPED_NATIVE_TOKEN,
  100: NETWORK_CONFIG[100].WRAPPED_NATIVE_TOKEN,
};

export const tokenInfo: { [key: number]: string } = {
  1: NETWORK_CONFIG[1].TOKENS,
  5: NETWORK_CONFIG[5].TOKENS,
  100: NETWORK_CONFIG[100].TOKENS,
};

export const SPOILS_BASIS_POINTS = 1000;

export const INVOICE_VERSION = 'smart-escrow-v1';
