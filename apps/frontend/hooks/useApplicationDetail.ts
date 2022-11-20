import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { client, APPLICATION_DETAIL_QUERY } from '../gql';
import { camelize } from '../utils';

const useApplicationDetail = () => {
  const router = useRouter();
  const applicationId = _.get(router, 'query.application');
  const { data: session } = useSession();

  const applicationQueryResult = async () => {
    if (!applicationId) return;
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: APPLICATION_DETAIL_QUERY,
      variables: {
        id: applicationId,
      },
    });

    return camelize(_.get(data, 'applications_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    ['applicationDetail', applicationId],
    applicationQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useApplicationDetail;
