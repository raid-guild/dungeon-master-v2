/* eslint-disable no-use-before-define */
import _ from 'lodash';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { client, RAIDS_LIST_QUERY, RAIDS_COUNT_QUERY } from '../gql';
import { camelize, IRaid } from '../utils';

const where = (
  raidStatusFilterKey: string,
  raidRolesFilterKey: string,
  raidSortKey: raidSortKeys
) => ({
  ...(raidStatusFilterKey === 'ACTIVE' && {
    _or: [
      { status_key: { _eq: 'PREPARING' } },
      { status_key: { _eq: 'RAIDING' } },
      { status_key: { _eq: 'AWAITING' } },
    ],
  }),
  ...(raidStatusFilterKey !== 'ACTIVE' &&
    raidStatusFilterKey !== 'ALL' && {
      status_key: { _eq: raidStatusFilterKey },
    }),
  ...(raidStatusFilterKey === 'ALL' && {}),
  ...(raidSortKey === 'oldestComment' && {
    _or: [
      { status_key: { _eq: 'PREPARING' } },
      { status_key: { _eq: 'RAIDING' } },
      { status_key: { _eq: 'AWAITING' } },
    ],
  }),
  ...(raidRolesFilterKey !== 'ANY_ROLE_SET' &&
    raidRolesFilterKey !== 'ALL' && {
      raids_roles_required: {
        guild_class: { guild_class: { _in: raidRolesFilterKey } },
      },
    }),
  ...(raidRolesFilterKey === 'ANY_ROLE_SET' && {
    raids_roles_required_aggregate: { count: { predicate: { _gt: 0 } } },
  }),
  ...(raidRolesFilterKey === 'ALL' && {}),
});

type raidSortKeys =
  | 'oldestComment'
  | 'recentComment'
  | 'name'
  | 'createDate'
  | 'startDate'
  | 'endDate'
  | 'recentlyUpdated';

const orderBy = (raidSortKey: raidSortKeys) => ({
  ...(raidSortKey === 'oldestComment' && {
    updates_aggregate: {
      min: {
        created_at: 'asc_nulls_last',
      },
    },
  }),
  ...(raidSortKey === 'recentComment' && {
    updates_aggregate: {
      min: {
        created_at: 'desc_nulls_last',
      },
    },
  }),
  ...(raidSortKey === 'name' && {
    name: 'asc',
  }),
  ...(raidSortKey === 'createDate' && {
    end_date: 'asc',
  }),
  ...(raidSortKey === 'startDate' && {
    start_date: 'asc',
  }),
  ...(raidSortKey === 'endDate' && {
    end_date: 'asc',
  }),
  ...(raidSortKey === 'recentlyUpdated' && {
    updated_at: 'asc',
  }),
});

const useRaidList = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}) => {
  const limit = 15;

  const raidQueryResult = async (pageParam: number) => {
    if (!token) return null;

    const result = await client({ token }).request(RAIDS_LIST_QUERY, {
      where: where(raidStatusFilterKey, raidRolesFilterKey, raidSortKey),
      limit,
      offset: pageParam * limit,
      order_by: orderBy(raidSortKey),
    });

    return camelize(_.get(result, 'raids'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IRaid>>, Error>({
    queryKey: [
      'raidsList',
      raidStatusFilterKey,
      raidRolesFilterKey,
      raidSortKey,
    ],
    queryFn: ({ pageParam = 0 }) => raidQueryResult(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), limit),
    enabled: Boolean(token),
  });

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

export const useRaidsCount = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}) => {
  const raidsCountQuery = async () => {
    const result = await client({ token }).request(RAIDS_COUNT_QUERY, {
      where: where(raidStatusFilterKey, raidRolesFilterKey, raidSortKey),
    });

    return _.get(result, 'raids_aggregate.aggregate.count', 0);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['raidsCount', raidStatusFilterKey, raidRolesFilterKey],
    queryFn: raidsCountQuery,
    enabled: Boolean(token),
  });

  return { data, isLoading, error };
};
