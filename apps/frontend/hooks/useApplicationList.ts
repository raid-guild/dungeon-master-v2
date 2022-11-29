import _ from 'lodash';
import { useInfiniteQuery } from 'react-query';
import { client, APPLICATION_LIST_QUERY } from '../gql';
import { camelize, IApplication } from '../utils';

const useApplicationList = ({ token }) => {
  const limit = 15;

  const applicationQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters

    const { data } = await client(token).query({
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
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IApplication>>, Error>(
    'applicationList',
    ({ pageParam = 0 }) => applicationQueryResult(pageParam),
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
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useApplicationList;
