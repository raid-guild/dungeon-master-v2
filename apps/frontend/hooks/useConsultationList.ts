import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useInfiniteQuery } from 'react-query';
import { client, CONSULTATION_LIST_QUERY } from '../gql';
import { camelize } from '../utils';

const useConsultationList = () => {
  const { data: session } = useSession();
  const limit = 15;

  const consultationQueryResult = async (pageParam: number) => {
    if (!session) return;
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: CONSULTATION_LIST_QUERY,
      variables: {
        limit,
        offset: pageParam * limit,
        where: { _not: { raids: {} } },
      },
    });

    return camelize(_.get(data, 'consultations'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<any, Error>(
    'consultationList',
    ({ pageParam = 0 }) => consultationQueryResult(pageParam),
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

export default useConsultationList;
