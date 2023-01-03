import _ from 'lodash';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { client, MEMBER_LIST_QUERY, MEMBER_SLIM_LIST_QUERY } from '../gql';
import { camelize, IMember, SIDEBAR_ACTION_STATES } from '../utils';

const useMemberList = ({
  token,
  memberRolesFilterKey,
  memberStatusFilterKey,
  memberSortKey,
}) => {
  const limit = 15;

  const where = {
    ...(memberRolesFilterKey !== 'ANY_ROLE_SET' &&
      memberRolesFilterKey !== 'ALL' && {
        guild_class: { guild_class: { _in: memberRolesFilterKey } },
      }),
    ...(memberStatusFilterKey === 'ALL' && {}),
    ...(memberStatusFilterKey !== 'ALL' && {
      is_raiding: { _eq: memberStatusFilterKey },
    }),
  };

  const orderBy = {
    ...(memberSortKey === 'name' && {
      name: 'asc',
    }),
  };

  const memberQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters

    const result = await client({ token }).request(MEMBER_LIST_QUERY, {
      where,
      limit,
      offset: pageParam * limit,
      order_by: orderBy,
    });

    return camelize(_.get(result, 'members'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IMember>>, Error>(
    ['memberList', memberRolesFilterKey, memberStatusFilterKey, memberSortKey],
    ({ pageParam = 0 }) => memberQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit);
      },
      enabled: !!token,
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

export default useMemberList;

export const useSlimMemberList = ({ token, button }) => {
  const memberSlimListQueryResult = async () => {
    if (!token) return;

    const result = await client({ token }).request(MEMBER_SLIM_LIST_QUERY);

    return camelize(_.get(result, 'data.members'));
  };

  const { status, error, data, isLoading } = useQuery<
    Array<Partial<IMember>>,
    Error
  >(['slimMemberList'], memberSlimListQueryResult, {
    enabled:
      !!token &&
      (button === SIDEBAR_ACTION_STATES.raider ||
        button === SIDEBAR_ACTION_STATES.cleric),
  });

  return {
    status,
    error,
    data,
    isLoading,
  };
};
