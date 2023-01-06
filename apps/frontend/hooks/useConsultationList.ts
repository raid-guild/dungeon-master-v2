import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, CONSULTATION_LIST_QUERY } from '../gql';
import { camelize, IConsultation } from '../utils';

const useConsultationList = ({ token }) => {
  const limit = 15;

  const consultationQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters

    const result = await client({ token }).request(CONSULTATION_LIST_QUERY, {
      limit,
      offset: pageParam * limit,
      where: {
        _and: {
          _not: { raids: {} },
          consultation_status_key: { _neq: 'CANCELLED' },
        },
      },
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
    ['consultationList'],
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
