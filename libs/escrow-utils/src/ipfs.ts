import axios from 'axios';
import { decode, encode } from 'bs58';
import _ from 'lodash';
import { Hex } from 'viem';

import { IPFS_ENDPOINT } from './constants';

// TODO migrate to pinata

export const ipfsUrl = (hash: string) => `${IPFS_ENDPOINT}/ipfs/${hash}`;

// const bytes = Buffer.from(Base58.decode(hash));
// return `0x${bytes.slice(2).toString('hex')}`;

export const pinJson = async (
  data: object,
  metadata: object,
  token: string
) => {
  const pinataData = JSON.stringify({
    pinataOptions: {
      cidVersion: 0,
    },
    pinataMetadata: {
      ...metadata,
    },
    pinataContent: {
      ...data,
    },
  });

  const config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: pinataData,
  };

  const res = await axios(config);

  return _.get(res, 'data.IpfsHash');
};

interface handleDetailsPinProps {
  details: object;
  name?: string;
  token: string;
}

export const handleDetailsPin = async ({
  details,
  name,
  token,
}: handleDetailsPinProps) => {
  const cid = await pinJson(details, { name }, token);

  return cid;
};

export const fetchToken = async (count: number = 0) => {
  const token = await fetch('/api/upload-start', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ count }),
  }).then((res) => res.text());

  return token;
};

/**
 * Converts IPFS CID version 0 (Base58) to a 32 bytes hex string and adds initial 0x.
 * @param cid - The 46 character long IPFS CID V0 string (starts with Qm).
 * @returns string
 */
export function convertIpfsCidV0ToByte32(cid: string): Hex {
  return `0x${Buffer.from(decode(cid).slice(2)).toString('hex')}`;
}

/**
 * Converts 32 byte hex string (initial 0x is removed) to Base58 IPFS content identifier version 0 address string (starts with Qm)
 * @param str - The 32 byte long hex string to encode to IPFS CID V0 (without initial 0x).
 * @returns string
 */
export function convertByte32ToIpfsCidV0(str: Hex) {
  let newStr: string = str;
  if (str.indexOf('0x') === 0) {
    newStr = str.slice(2);
  }
  return encode(Buffer.from(`1220${newStr}`, 'hex'));
}
