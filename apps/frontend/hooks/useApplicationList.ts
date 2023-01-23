import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, APPLICATION_LIST_QUERY } from '../gql';
import { camelize, IApplication } from '../utils';

const useApplicationList = ({ token, limit = 16 }) => {
  const applicationQueryResult = async (pageParam: number) => {
    if (!token) return null;
    // TODO handle filters

    const result = await client({ token }).request(APPLICATION_LIST_QUERY, {
      limit,
      offset: pageParam * limit,
      where: { _not: { member: {} } },
    });

    return camelize(_.get(result, 'applications'));
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
    ['applicationList'],
    ({ pageParam = 0 }) => applicationQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) =>
        _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit),
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
