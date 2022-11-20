import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useInfiniteQuery } from 'react-query';
import { client, MEMBER_LIST_QUERY } from '../gql';
import { camelize } from '../utils';

const useMemberList = () => {
  const { data: session } = useSession();
  const limit = 15;

  const memberQueryResult = async (pageParam: number) => {
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: MEMBER_LIST_QUERY,
      variables: {
        limit,
        offset: pageParam * limit,
        where: {},
      },
    });

    return camelize(_.get(data, 'members'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<any, Error>(
    'memberList',
    ({ pageParam = 0 }) => memberQueryResult(pageParam),
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

export default useMemberList;
