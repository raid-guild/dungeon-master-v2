import Base58 from 'bs58';
import { create } from 'ipfs-http-client';

import { INVOICE_VERSION, IPFS_ENDPOINT } from './constants';

// TODO migrate to pinata

const ipfsTheGraph = create({
  protocol: 'https',
  host: 'api.thegraph.com',
  port: 443,
  'api-path': '/ipfs/api/v0/',
} as any);

const ipfsInfura = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const uploadMetadata = async (meta: any) => {
  const metadata = { ...meta, version: INVOICE_VERSION };
  const objectString = JSON.stringify(metadata);
  const bufferedString = Buffer.from(objectString);
  const [node] = await Promise.all([
    ipfsTheGraph.add(bufferedString),
    ipfsInfura.add(bufferedString), // automatically pinned
  ]);
  const { hash } = (node as any)[0];
  await ipfsTheGraph.pin.add(hash);
  const bytes = Buffer.from(Base58.decode(hash));
  return `0x${bytes.slice(2).toString('hex')}`;
};

export const uploadDisputeDetails = async (meta: {
  reason: string;
  invoice: string;
  amount: string;
}) => {
  const metadata = { ...meta, version: INVOICE_VERSION };
  const objectString = JSON.stringify(metadata);
  const bufferedString = Buffer.from(objectString);
  const [node] = await Promise.all([
    ipfsTheGraph.add(bufferedString),
    ipfsInfura.add(bufferedString), // automatically pinned
  ]);
  const { hash } = (node as any)[0];
  await ipfsTheGraph.pin.add(hash);
  const bytes = Buffer.from(Base58.decode(hash));
  return `0x${bytes.slice(2).toString('hex')}`;
};

export const getIpfsLink = (hash: string) => `${IPFS_ENDPOINT}/ipfs/${hash}`;
