import _ from 'lodash';
import { Hex } from 'viem';

import KlerosLogo from './assets/kleros-logo.png';
import LexDAOLogo from './assets/lex-dao.png';

export const IPFS_ENDPOINT = 'https://ipfs.infura.io';

export const SPOILS_BASIS_POINTS = 1000;

export const INVOICE_VERSION = 'smart-escrow-v1';

// RaidGuild DAO treasury address V3
export const RAIDGUILD_DAO = {
  100: _.toLower('0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986') as Hex,
};

// RaidGuild multisig(s)
export const RAIDGUILD_MULTISIG = {
  1: _.toLower('0x3C3692681cD1c0F42FA68A2521719Cc24CEc3AF3') as Hex,
};

export const GANGGANG_MULTISIG = {
  100: '0xCFFF4a6EB44bA088EEa89A84Dd113eCfDEDA9641',
};

// @note: Kleros And Smart Invoice use the same safe address,
const SMART_INVOICE_ARBITRATION_SAFE = _.toLower(
  '0x18542245cA523DFF96AF766047fE9423E0BED3C0'
) as Hex;

// https://github.com/lexDAO/Arbitration/blob/master/README.md#resolution-of-any-arbitration-request
const LEXDAO_ARBITRATION_SAFE = {
  1: _.toLower('0x5B620676E28693fC14876b035b08CbB1B657dF38') as Hex,
  100: _.toLower('0x153Fbf5da827903e030Dc317C4031755D74D508a') as Hex,
};

const LEXDAO_DATA = {
  id: 'lexdao',
  name: 'LexDAO',
  logoUrl: LexDAOLogo,
  termsUrl: 'https://docs.smartinvoice.xyz/arbitration/lexdao-arbitration',
};

const KLEROS_DATA = {
  id: 'kleros',
  name: 'Kleros',
  disclaimer:
    'Only choose Kleros if total invoice value is greater than 1000 USD',
  logoUrl: KlerosLogo,
  termsUrl: 'https://docs.smartinvoice.xyz/arbitration/kleros-arbitration',
};

export const PAYMENT_TYPES = {
  NATIVE: 'native',
  TOKEN: 'token',
};

interface Tokens {
  [key: string]: {
    decimals: number;
    address: Hex;
  };
}

interface Resolvers {
  [key: string]: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logoUrl: any;
    termsUrl: string;
  };
}

interface NetworkConfig {
  SUBGRAPH: string;
  INVOICE_FACTORY: Hex;
  WRAPPED_NATIVE_TOKEN: Hex;
  TOKENS: Tokens;
  RESOLVERS: Resolvers;
  ZAP_ADDRESS?: Hex;
  DAO_ADDRESS?: Hex;
  TREASURY_ADDRESS?: Hex;
  SPOILS_MANAGER?: Hex;
}

const GRAPH_STUDIO_ID = '78711';

export const getGraphStudioSubgraphUrl = (subgraph: string) =>
  `https://api.studio.thegraph.com/query/${GRAPH_STUDIO_ID}/${subgraph}/version/latest`;

export const NETWORK_CONFIG: { [key: number]: NetworkConfig } = {
  1: {
    SUBGRAPH: getGraphStudioSubgraphUrl('smart-invoice'),
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    ) as Hex,
    INVOICE_FACTORY: _.toLower(
      '0x5E14cF595e18F91170009946205f8BBa21b323ca'
    ) as Hex,
    ZAP_ADDRESS: _.toLower('0xDF8A3D4277423887591C5F69CAf6FF148F394f68') as Hex,
    DAO_ADDRESS: _.toLower('0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986') as Hex,
    TOKENS: {
      WETH: {
        decimals: 18,
        address: _.toLower('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') as Hex,
      },
      DAI: {
        decimals: 18,
        address: _.toLower('0x6B175474E89094C44Da98b954EedeAC495271d0F') as Hex,
      },
    },
    RESOLVERS: {
      [LEXDAO_ARBITRATION_SAFE[1]]: LEXDAO_DATA,
    },
  },
  10: {
    SUBGRAPH: getGraphStudioSubgraphUrl('smart-invoice-optimism'),
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0x4200000000000000000000000000000000000006',
    ) as Hex,
    INVOICE_FACTORY: _.toLower(
      '0xF9822818143948237A60A1a1CEFC85D6F1b929Df',
    ) as Hex,
    ZAP_ADDRESS: _.toLower('0xd5a159a1D70888047DF151B757157eb9A03e7075') as Hex,
    DAO_ADDRESS: _.toLower('0xf4f65a5c6590fbc15b3869510e5f1e7114041c53') as Hex,
    TREASURY_ADDRESS: _.toLower(
      '0x96fba732dca8d89ce78c01613c09a3c0c4d7ddb2'
    ) as Hex,
    SPOILS_MANAGER: _.toLower(
      '0x9aFA71188fC0cd4445AbC4e671B466C2ea405130'
    ) as Hex,
    TOKENS: {
      USDC: {
        decimals: 6,
        address: _.toLower('0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85') as Hex,
      },
    },
    RESOLVERS: {
      [SMART_INVOICE_ARBITRATION_SAFE]:
        KLEROS_DATA,
    },
  },
  100: {
    SUBGRAPH: getGraphStudioSubgraphUrl('smart-invoice-gnosis'),
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    ) as Hex,
    INVOICE_FACTORY: _.toLower(
      '0xdDd96D43b0B2Ca179DCefA58e71798d0ce56c9c8',
    ) as Hex,
    ZAP_ADDRESS: _.toLower('0xE52fFb810cFb882A5C1085b9c01F189cD356a9B4') as Hex,
    DAO_ADDRESS: _.toLower('0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986') as Hex,
    TREASURY_ADDRESS: _.toLower(
      '0x181ebdb03cb4b54f4020622f1b0eacd67a8c63ac'
    ) as Hex,
    SPOILS_MANAGER: _.toLower(
      '0x8C9c85b41a9491388320eA27d74A037D93d07C0F'
    ) as Hex,
    TOKENS: {
      WXDAI: {
        decimals: 18,
        address: _.toLower('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d') as Hex,
      },
      WETH: {
        decimals: 18,
        address: _.toLower('0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1') as Hex,
      },
    },
    RESOLVERS: {
      [LEXDAO_ARBITRATION_SAFE[100]]: LEXDAO_DATA,
    },
  },
  11155111: {
    SUBGRAPH: getGraphStudioSubgraphUrl('smart-invoice-sepolia'),
    WRAPPED_NATIVE_TOKEN: _.toLower(
      '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    ) as Hex,
    INVOICE_FACTORY: _.toLower(
      '0x8227b9868e00B8eE951F17B480D369b84Cd17c20',
    ) as Hex,
    ZAP_ADDRESS: _.toLower('0x1b12589bf3a11294eeef22020d8003e07686dc23') as Hex,
    DAO_ADDRESS: _.toLower(
      '0x67e428101F4c688f228fb453659c5d7952075919 '
    ) as Hex,
    TOKENS: {
      WETH: {
        decimals: 18,
        address: _.toLower('0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14') as Hex,
      },
    },
    RESOLVERS: {
      // NOTE: on sepolia, we use the same address as on gnosis for testing
      [LEXDAO_ARBITRATION_SAFE[100]]: LEXDAO_DATA,
    },
  },
};

export const nativeSymbols: { [key: number]: string } = {
  1: 'ETH',
  10: 'ETH',
  100: 'xDAI',
};

export const wrappedNativeToken: { [key: number]: Hex } = {
  1: NETWORK_CONFIG[1].WRAPPED_NATIVE_TOKEN,
  10: NETWORK_CONFIG[10].WRAPPED_NATIVE_TOKEN,
  100: NETWORK_CONFIG[100].WRAPPED_NATIVE_TOKEN,
};

export const tokenInfo: { [key: number]: Tokens } = {
  1: NETWORK_CONFIG[1].TOKENS,
  10: NETWORK_CONFIG[10].TOKENS,
  100: NETWORK_CONFIG[100].TOKENS,
};
