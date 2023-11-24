/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMember } from '@raidguild/dm-types';
import _ from 'lodash';

export const truncateAddress = (addr: string | undefined): string =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

export const clearNonObjects = (array: any[]): object[] => {
  const noNull = _.filter(array, (x: any) => x !== null);
  const noFalse = _.filter(noNull, (x: any) => x !== false);
  return _.filter(noFalse, (x: any) => x !== undefined);
};

export const memberDisplayName = (member: Partial<IMember>, ensName?: string) =>
  _.get(member, 'name') ||
  ensName || // ens record from chain/wagmi
  _.get(member, 'contactInfo.telegram') ||
  truncateAddress(_.get(member, 'ethAddress'));

export const displayDate = (date: string) => {
  const options = { year: 'numeric', month: 'short', day: '2-digit' } as const;
  const today = new Date(date);
  let formattedDate = today.toLocaleDateString('en-US', options);
  if (formattedDate.slice(-4) === '1970') {
    formattedDate = 'N/A';
  }
  return formattedDate;
};

export function commify(x: number | bigint) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
