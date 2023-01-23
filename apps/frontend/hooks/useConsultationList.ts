import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, CONSULTATION_LIST_QUERY } from '../gql';
import { camelize, IConsultation } from '../utils';

type consultationSortKeys = 'name' | 'recentlyAdded';

const orderBy = (consultationSortKey: consultationSortKeys) => ({
  ...(consultationSortKey === 'name' && {
    name: 'asc',
  }),
  ...(consultationSortKey === 'recentlyAdded' && {
    created_at: 'desc',
  }),
});

const useConsultationList = ({ token, consultationSortKey }) => {
  const limit = 15;
  console.log('sort key', consultationSortKey);
  const consultationQueryResult = async (pageParam: number) => {
    if (!token) return;

    const result = await client({ token }).request(CONSULTATION_LIST_QUERY, {
      limit,
      offset: pageParam * limit,
      where: {
        _and: {
          _not: { raids: {} },
          consultation_status_key: { _neq: 'CANCELLED' },
        },
      },
      order_by: orderBy(consultationSortKey),
    });

    return camelize(_.get(result, 'consultations'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IConsultation>>, Error>(
    ['consultationList', consultationSortKey],
    ({ pageParam = 0 }) => consultationQueryResult(pageParam),
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
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useConsultationList;
