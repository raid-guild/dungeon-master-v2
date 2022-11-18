import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, APPLICATION_LIST_QUERY } from '../gql';

const useApplicationList = () => {
  const { data: session } = useSession();

  const applicationQueryResult = async () => {
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: APPLICATION_LIST_QUERY,
    });

    return _.get(data, 'applications');
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    'applicationList',
    applicationQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useApplicationList;
