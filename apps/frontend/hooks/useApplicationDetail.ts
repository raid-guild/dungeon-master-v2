import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { client, APPLICATION_DETAIL_QUERY } from '../gql';
import { camelize, IApplication } from '../utils';

const useApplicationDetail = ({ token }) => {
  const router = useRouter();
  const applicationId = _.get(router, 'query.application');

  const applicationQueryResult = async () => {
    if (!applicationId || !token) return;
    // TODO handle filters

    const { data } = await client(token).query({
      query: APPLICATION_DETAIL_QUERY,
      variables: {
        id: applicationId,
      },
    });

    return camelize(_.get(data, 'applications_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IApplication,
    Error
  >(['applicationDetail', applicationId], applicationQueryResult, {
    enabled: Boolean(token),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useApplicationDetail;
