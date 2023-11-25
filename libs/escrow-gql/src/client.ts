import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const graphUrl = (chainId: number = 4) =>
  `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[chainId].SUBGRAPH}`;

export const SUPPORTED_NETWORKS = _.map(_.keys(NETWORK_CONFIG), _.toNumber);

export const client = (chainId: number) => new GraphQLClient(graphUrl(chainId));
export const altClient = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/psparacino/v1-xdai-smart-invoices'
);
export const thirdClient = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/dan13ram/xdai-smart-invoices'
);
