/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';

export * from './auth';
export * from './chains';
export * from './constants';
export * from './general';
export * from './pinata';
export * from './raids';
export * from './table';
export * from './web3';
export const camelize = (obj: any) =>
  _.transform(obj, (acc: any, value: any, key: any, target: any) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);

    acc[camelKey] = _.isObject(value) ? camelize(value) : value;
  });
