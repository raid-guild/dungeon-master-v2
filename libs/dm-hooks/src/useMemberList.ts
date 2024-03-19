import {
  client,
  MEMBER_LIST_QUERY,
  MEMBER_SLIM_LIST_QUERY,
  MEMBERS_COUNT_QUERY,
} from '@raidguild/dm-graphql';
import { IMember } from '@raidguild/dm-types';
import { camelize, SIDEBAR_ACTION_STATES } from '@raidguild/dm-utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const where = (
  memberRolesFilterKey: string,
  memberStatusFilterKey: string
) => ({
  ...(memberRolesFilterKey !== 'ANY_ROLE_SET' &&
    memberRolesFilterKey !== 'ALL' && {
      guild_class: { guild_class: { _in: memberRolesFilterKey } },
    }),
  ...(memberStatusFilterKey === 'ALL' && {}),
  ...(memberStatusFilterKey !== 'ALL' && {
    is_raiding: { _eq: memberStatusFilterKey },
  }),
});

const orderBy = (memberSortKey: string) => ({
  ...(memberSortKey === 'name' && {
    name: 'asc',
  }),
});

type memberListType = {
  token: string;
  memberRolesFilterKey?: string;
  memberStatusFilterKey?: string;
  memberSortKey?: string;
  limit?: number;
};

const useMemberList = ({
  token,
  memberRolesFilterKey = 'ALL',
  memberStatusFilterKey = 'ALL',
  memberSortKey = 'name',
  limit = 16,
}: memberListType) => {
  const memberQueryResult = async (pageParam: number) => {
    if (!token) return null;
    // TODO handle filters

    const result = await client({ token }).request(MEMBER_LIST_QUERY, {
      limit,
      offset: pageParam * limit,
      where: where(memberRolesFilterKey, memberStatusFilterKey),
      order_by: orderBy(memberSortKey),
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
      getNextPageParam: (lastPage, allPages) =>
        _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit),
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

export const useSlimMemberList = ({
  token,
  button,
}: {
  token: string;
  button: string;
}) => {
  const memberSlimListQueryResult = async () => {
    if (!token) return null;

    const result = await client({ token }).request(MEMBER_SLIM_LIST_QUERY);

    return camelize(_.get(result, 'members'));
  };

  const { status, error, data, isLoading } = useQuery<
    Array<Partial<IMember>>,
    Error
  >(['slimMemberList'], memberSlimListQueryResult, {
    enabled:
      !!token &&
      (button === SIDEBAR_ACTION_STATES.select ||
        button === SIDEBAR_ACTION_STATES.cleric),
  });

  return {
    status,
    error,
    data,
    isLoading,
  };
};

type MembersCountType = {
  token: string;
  memberRolesFilterKey?: string;
  memberStatusFilterKey?: string;
};

export const useMembersCount = ({
  token,
  memberRolesFilterKey = 'ALL',
  memberStatusFilterKey = 'ALL',
}: MembersCountType) => {
  const membersCountQuery = async () => {
    const result = await client({ token }).request(MEMBERS_COUNT_QUERY, {
      where: where(memberRolesFilterKey, memberStatusFilterKey),
    });

    return _.get(result, 'members_aggregate.aggregate.count', 0);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['membersCount', memberRolesFilterKey, memberStatusFilterKey],
    queryFn: membersCountQuery,
    enabled: Boolean(token),
  });

  return { data, isLoading, error };
};
