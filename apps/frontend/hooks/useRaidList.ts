import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useInfiniteQuery } from 'react-query';
import { client, RAIDS_LIST_QUERY } from '../gql';
import { camelize } from '../utils';

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

  const raidQueryResult = async (pageParam: number) => {
    if (!session) return;
    // TODO handle filters
    console.log(session);

    const { data } = await client(_.get(session, 'token')).query({
      query: RAIDS_LIST_QUERY,
      variables: {
        where,
        limit,
        offset: pageParam * limit,
      },
    });

    return camelize(_.get(data, 'raids'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    'raidsList',
    ({ pageParam = 0 }) => raidQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit);
      },
    }
  );

  return {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
  };
};

export default useRaidList;
