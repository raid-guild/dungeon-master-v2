/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import {
  client,
  MEMBER_ADDRESS_LOOKUP_QUERY,
  RAID_BY_ID_QUERY,
  RAID_BY_V1_ID_QUERY,
} from '.';

export const memberAddressLookup = async () => {
  const result = await client({}).request(MEMBER_ADDRESS_LOOKUP_QUERY);
  return result;
};

export const fetchRaid = async (raidId: string, token?: string) => {
  const query = raidId.includes('-') ? RAID_BY_ID_QUERY : RAID_BY_V1_ID_QUERY;

  const result = await client({ token }).request(query, { raidId });

  return _.get(result, 'data.raids');
};
