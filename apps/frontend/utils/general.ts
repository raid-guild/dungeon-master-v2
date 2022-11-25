import _ from 'lodash';
import { IMember } from './definitions';

export const truncateAddress = (addr: string | undefined): string =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

export const clearNonObjects = (array: any[]): object[] => {
  const noNull = _.filter(array, (x: any) => x !== null);
  const noFalse = _.filter(noNull, (x: any) => x !== false);
  return _.filter(noFalse, (x: any) => x !== undefined);
};

export const memberDisplayName = (
  member: Partial<IMember>,
  ensName?: string
) => {
  return (
    _.get(member, 'name') ||
    ensName || // ens record from chain/wagmi
    _.get(member, 'ensName') || // ens record from db
    _.get(member, 'telegramHandle') ||
    truncateAddress(_.get(member, 'address'))
  );
};
