import _ from 'lodash';
export * from '../types';
export * from './constants';
export * from './general';
export * from './raids';
export * from './wagmiClient';

export const camelize = (obj: any) =>
  _.transform(obj, (acc: any, value: any, key: any, target: any) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);

    acc[camelKey] = _.isObject(value) ? camelize(value) : value;
  });
