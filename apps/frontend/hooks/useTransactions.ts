import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, TRANSACTIONS_QUERY } from '../gql';
import { camelize, IConsultation } from '../utils';

const RG_GNOSIS_DAO_ADDRESS = '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f';

const useTransactions = ({ token }) => {
  const limit = 15;

  const consultationQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters

    const { data } = await client(undefined, 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai').query({
      query: TRANSACTIONS_QUERY,
      variables: {
        first: limit,
        skip: pageParam * limit,
        molochAddress: RG_GNOSIS_DAO_ADDRESS,
      },
    });

    return camelize(_.get(data, 'balances'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IConsultation>>, Error>(
    ['transactions'],
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

export default useTransactions;
