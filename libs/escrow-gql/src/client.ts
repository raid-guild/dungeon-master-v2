import { createClient, dedupExchange, fetchExchange } from 'urql';

// TODO use gql-request

import { NETWORK_CONFIG } from '@raidguild/escrow-utils';

export const graphUrls: { [key: number]: string } = {
  1: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[1].SUBGRAPH}`,
  4: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[4].SUBGRAPH}`,
  5: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[5].SUBGRAPH}`,
  100: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[100].SUBGRAPH}`,
};

const getGraphUrl = (chainId: number) => graphUrls[chainId] || graphUrls[4];

export const SUPPORTED_NETWORKS = Object.keys(NETWORK_CONFIG)
  .map((n) => Number(n))
  .filter((n) => !isNaN(n));

export const clients = SUPPORTED_NETWORKS.reduce(
  (o, chainId) => ({
    ...o,
    [chainId]: createClient({
      url: getGraphUrl(chainId),
      exchanges: [dedupExchange, fetchExchange],
    }),
  }),
  {}
);