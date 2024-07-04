import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const STUDIO_ID = '78711';
const STUDIO_URL = `https://api.studio.thegraph.com/query/${STUDIO_ID}`;


const graphUrl = (chainId: number = 4) =>
  `${STUDIO_URL}/${NETWORK_CONFIG[chainId].SUBGRAPH}`;

export const SUPPORTED_NETWORKS = _.map(_.keys(NETWORK_CONFIG), _.toNumber);

export const client = (chainId: number) => new GraphQLClient(graphUrl(chainId));

export const v1Client = new GraphQLClient(
  `${STUDIO_URL}/dan13ram/xdai-smart-invoices` // TODO: deploy v1 subgraph to STUDIO URL // replaced url but it wouldn't work
);
