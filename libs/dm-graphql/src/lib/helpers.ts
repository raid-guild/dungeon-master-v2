/* eslint-disable import/prefer-default-export */
import { client, MEMBER_ADDRESS_LOOKUP_QUERY } from '.';

export const memberAddressLookup = async () => {
  const result = await client({}).request(MEMBER_ADDRESS_LOOKUP_QUERY);
  return result;
};
