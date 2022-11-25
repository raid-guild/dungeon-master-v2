import {
  client,
  MEMBER_ADDRESS_LOOKUP_QUERY,
  MEMBER_SLIM_LIST_QUERY,
} from '../gql';

export const memberAddressLookup = async () => {
  const result = await client().query({
    query: MEMBER_ADDRESS_LOOKUP_QUERY,
  });
  return result;
};

export const getMembersSlimList = async () => {
  const result = await client().query({
    query: MEMBER_SLIM_LIST_QUERY,
  });
  return result;
};
