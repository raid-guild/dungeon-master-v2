import _ from 'lodash';

export const truncateAddress = (addr: string | undefined): string =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

export const clearNonObjects = (array: any[]): object[] => {
  const noNull = _.filter(array, (x: any) => x !== null);
  const noFalse = _.filter(noNull, (x: any) => x !== false);
  return _.filter(noFalse, (x: any) => x !== undefined);
};
