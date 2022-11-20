import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, RAIDS_LIST_QUERY } from '../gql';

const useRaidList = () => {
  const { data: session } = useSession();
  const limit = 15;
  const where = {
    _or: [
      { status: { _eq: 'PREPARING' } },
      { status: { _eq: 'RAIDING' } },
      { status: { _eq: 'AWAITING' } },
    ],
  };

  const raidQueryResult = async () => {
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: RAIDS_LIST_QUERY,
    });

    return _.get(data, 'raids');
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    'raidsList',
    raidQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useRaidList;
