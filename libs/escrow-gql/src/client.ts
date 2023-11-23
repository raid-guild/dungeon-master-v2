import { createClient, fetchExchange } from 'urql';

// TODO use gql-request

import { NETWORK_CONFIG } from '@raidguild/escrow-utils';

const graphUrl = (chainId: number = 4) => {
  return `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[chainId].SUBGRAPH}`;
};

export const SUPPORTED_NETWORKS = Object.keys(NETWORK_CONFIG)
  .map((n) => Number(n))
  .filter((n) => !isNaN(n));

export const clients = SUPPORTED_NETWORKS.reduce(
  (o, chainId) => ({
    ...o,
    [chainId]: createClient({
      url: graphUrl(chainId),
      exchanges: [fetchExchange],
    }),
  }),
  {}
);
