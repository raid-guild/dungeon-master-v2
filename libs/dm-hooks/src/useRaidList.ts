/* eslint-disable no-use-before-define */
import _ from 'lodash';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  client,
  RAIDS_LIST_QUERY,
  RAIDS_COUNT_QUERY,
  RAIDING_RAIDS_BY_LAST_UPDATE,
  RAIDS_LIST_AND_LAST_UPDATE_QUERY,
} from '@raidguild/dm-graphql';
import { raidSortKeys } from '@raidguild/dm-types';
import { camelize, IRaid } from '@raidguild/dm-utils';
import { checkProperties } from 'ethers/lib/utils.js';

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

const orderBy = (raidSortKey: raidSortKeys) => ({
  ...(raidSortKey === 'oldestComment' && {
    updates_aggregate: {
      min: {
        created_at: 'asc_nulls_first',
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

const latestUpdateOrderBy = (raidSortKey: raidSortKeys) => ({
  ...(raidSortKey === 'oldestComment' && {
    latest_update_created_at: 'asc_nulls_first',
  }),
  ...(raidSortKey === 'recentComment' && {
    latest_update_created_at: 'desc_nulls_last',
  }),
});

// return asc_nulls_first or desc_nulls_last
// const latestUpdateOrderBy = (raidSortKey: raidSortKeys) => {
//   if (raidSortKey === 'oldestComment') {
//     return 'asc_nulls_first';
//   } else if (raidSortKey === 'recentComment') {
//     return 'desc_nulls_last';
//   }
// };

type RaidListType = {
  token: string;
  raidStatusFilterKey: string;
  raidRolesFilterKey: string;
  raidSortKey: raidSortKeys;
};

const useRaidList = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}: RaidListType) => {
  const limit = 15;

  const raidQueryResult = async (pageParam: number) => {
    if (!token) return null;

    if (raidSortKey === 'oldestComment' || raidSortKey === 'recentComment') {
      const result = await client({ token }).request(
        RAIDS_LIST_AND_LAST_UPDATE_QUERY,
        {
          where: where(raidStatusFilterKey, raidRolesFilterKey, raidSortKey),
          limit,
          offset: pageParam * limit,
          order_by: orderBy(raidSortKey),
          latest_update_order_by: latestUpdateOrderBy(raidSortKey),
        }
      );
      const raids = _.get(result, 'raids');
      const idsByLatestUpdate = _.get(result, 'raiding_raids_by_last_update');
      const latestUpdatesSortedRaidList = camelize(
        _.map(idsByLatestUpdate, (latestUpdate: { raid_id: string }) => {
          const raid = _.find(raids, { id: latestUpdate.raid_id });
          return raid;
        })
      );
      const paginatedRaidList = _.slice(
        latestUpdatesSortedRaidList,
        pageParam * limit,
        (pageParam + 1) * limit
      );
      return paginatedRaidList;
    }

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

type RaidsCountType = {
  token: string;
  raidStatusFilterKey: string;
  raidRolesFilterKey: string;
  raidSortKey: raidSortKeys;
};

export const useRaidsCount = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}: RaidsCountType) => {
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
