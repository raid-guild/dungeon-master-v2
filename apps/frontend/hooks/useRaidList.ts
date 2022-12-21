import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, RAIDS_LIST_QUERY } from '../gql';
import { camelize, IRaid } from '../utils';

const useRaidList = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}) => {
  const limit = 15;

  const where = {
    ...(raidStatusFilterKey === 'ACTIVE' &&
      raidStatusFilterKey !== 'ALL' && {
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
    ...(raidRolesFilterKey === 'ANY_ROLE_SET' &&
      raidRolesFilterKey !== 'ALL' && {
        raids_roles_required_aggregate: { count: { predicate: { _gt: 0 } } },
      }),
    ...(raidRolesFilterKey === 'ALL' && {}),
  };

  const orderBy = {
    ...(raidSortKey === 'oldestComment' && {
      updated_at: 'desc',
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
        order_by: orderBy,
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
  } = useInfiniteQuery<Array<Array<IRaid>>, Error>({
    queryKey: [
      'raidsList',
      raidStatusFilterKey,
      raidRolesFilterKey,
      raidSortKey,
    ],
    queryFn: ({ pageParam = 0 }) => raidQueryResult(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), limit);
    },
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
