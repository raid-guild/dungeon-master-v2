import { createClient, dedupExchange, fetchExchange } from 'urql';

import { NETWORK_CONFIG } from '../utils/constants';

// const graphUrls = {
//   4: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[4].SUBGRAPH}`,
//   100: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[100].SUBGRAPH}`,
//   1: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[1].SUBGRAPH}`,
//   5: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[5].SUBGRAPH}`,
// };


export const graphUrls = {
  1: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[1].SUBGRAPH}`,
  4: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[4].SUBGRAPH}`,
  5: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[5].SUBGRAPH}`,
  100: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[100].SUBGRAPH}`,
};

const getGraphUrl = chainId => graphUrls[chainId] || graphUrls[4];

export const SUPPORTED_NETWORKS = Object.keys(NETWORK_CONFIG).map(n => Number(n)).filter((n) => !isNaN(n));

export const clients = SUPPORTED_NETWORKS.reduce(
  (o, chainId) => ({
    ...o,
    [chainId]: createClient({
      url: getGraphUrl(chainId),
      exchanges: [dedupExchange, fetchExchange],
    }),
  }),
  {},
);
