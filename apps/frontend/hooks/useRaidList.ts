import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, RAIDS_LIST_QUERY } from '../gql';
import { camelize, IRaid } from '../utils';

const useRaidList = ({ token }) => {
  const limit = 15;
  const where = {
    _or: [
      { status_key: { _eq: 'PREPARING' } },
      { status_key: { _eq: 'RAIDING' } },
      { status_key: { _eq: 'AWAITING' } },
    ],
  };

  const raidQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters

    const { data } = await client(token).query({
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
  } = useInfiniteQuery<Array<Array<IRaid>>, Error>(
    ['raidsList'],
    ({ pageParam = 0 }) => raidQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit);
      },
      enabled: Boolean(token),
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
