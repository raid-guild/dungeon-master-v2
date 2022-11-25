import _ from 'lodash';
import { useInfiniteQuery } from 'react-query';
import { client, MEMBER_LIST_QUERY } from '../gql';
import { camelize, IMember } from '../utils';

const useMemberList = ({ token }) => {
  const limit = 15;

  const memberQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters

    const { data } = await client(token).query({
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
  } = useInfiniteQuery<Array<Array<IMember>>, Error>(
    'memberList',
    ({ pageParam = 0 }) => memberQueryResult(pageParam),
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

export default useMemberList;
