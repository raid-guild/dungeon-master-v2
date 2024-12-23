/* eslint-disable no-use-before-define */
import {
  client,
  RAIDING_RAIDS_BY_LAST_UPDATE,
  RAIDS_COUNT_QUERY,
  RAIDS_LIST_AND_LAST_UPDATE_QUERY,
  RAIDS_LIST_QUERY,
} from '@raidguild/dm-graphql';
import { IRaid } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const where = (
  raidStatusFilterKey: string,
  raidRolesFilterKey: string,
  raidSortKey: string,
  raidPortfolioStatusKey: string
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
  ...(raidPortfolioStatusKey === 'PUBLISHED' && {
    portfolios_aggregate: { count: { predicate: { _gt: 0 } } },
  }),
  ...(raidPortfolioStatusKey === 'PENDING' && {
    portfolios_aggregate: { count: { predicate: { _lte: 0 } } },
  }),
  ...(raidPortfolioStatusKey === 'ALL' && {}),
});

const orderBy = (raidSortKey: string) => ({
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

const latestUpdateOrderBy = (raidSortKey: string) => ({
  ...(raidSortKey === 'oldestComment' && {
    latest_update_created_at: 'asc_nulls_first',
  }),
  ...(raidSortKey === 'recentComment' && {
    latest_update_created_at: 'desc_nulls_last',
  }),
});

// return asc_nulls_first or desc_nulls_last
// const latestUpdateOrderBy = (raidSortKey: string) => {
//   if (raidSortKey === 'oldestComment') {
//     return 'asc_nulls_first';
//   } else if (raidSortKey === 'recentComment') {
//     return 'desc_nulls_last';
//   }
// };

type RaidListType = {
  token: string;
  raidPortfolioStatusFilterKey: string;
  raidStatusFilterKey: string;
  raidRolesFilterKey: string;
  raidSortKey: string;
};

const useRaidList = ({
  token,
  raidPortfolioStatusFilterKey,
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
          where: where(
            raidStatusFilterKey,
            raidRolesFilterKey,
            raidSortKey,
            raidPortfolioStatusFilterKey
          ),
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
      where: where(
        raidStatusFilterKey,
        raidRolesFilterKey,
        raidSortKey,
        raidPortfolioStatusFilterKey
      ),
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
      raidPortfolioStatusFilterKey,
    ],
    queryFn: ({ pageParam }) => raidQueryResult(pageParam as unknown as number),
    initialPageParam: 0,
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
  raidSortKey: string;
  raidPortfolioStatusFilterKey: string;
};

export const useRaidsCount = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
  raidPortfolioStatusFilterKey,
}: RaidsCountType) => {
  const raidsCountQuery = async () => {
    const result = await client({ token }).request(RAIDS_COUNT_QUERY, {
      where: where(
        raidStatusFilterKey,
        raidRolesFilterKey,
        raidSortKey,
        raidPortfolioStatusFilterKey
      ),
    });

    return _.get(result, 'raids_aggregate.aggregate.count', 0);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'raidsCount',
      raidStatusFilterKey,
      raidRolesFilterKey,
      raidPortfolioStatusFilterKey,
    ],
    queryFn: raidsCountQuery,
    enabled: Boolean(token),
  });

  return { data, isLoading, error };
};
