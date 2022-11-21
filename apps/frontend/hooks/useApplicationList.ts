import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useInfiniteQuery } from 'react-query';
import { client, APPLICATION_LIST_QUERY } from '../gql';
import { camelize } from '../utils';

const useApplicationList = () => {
  const { data: session } = useSession();
  const limit = 15;

  const applicationQueryResult = async (pageParam: number) => {
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: APPLICATION_LIST_QUERY,
      variables: {
        limit,
        offset: pageParam * limit,
        where: { _not: { member: {} } },
      },
    });

    return camelize(_.get(data, 'applications'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<any, Error>(
    'applicationList',
    ({ pageParam = 0 }) => applicationQueryResult(pageParam),
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
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useApplicationList;
