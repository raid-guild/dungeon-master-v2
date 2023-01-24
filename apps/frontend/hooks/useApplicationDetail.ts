import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, APPLICATION_DETAIL_QUERY } from '../gql';
import { camelize, IApplication } from '../utils';

const useApplicationDetail = ({ token, applicationId }) => {
  const applicationQueryResult = async () => {
    if (!applicationId || !token) return null;
    // TODO handle filters

    const result = await client({ token }).request(APPLICATION_DETAIL_QUERY, {
      id: applicationId,
    });

    return camelize(_.get(result, 'applications_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IApplication,
    Error
  >(['applicationDetail', applicationId], applicationQueryResult, {
    enabled: Boolean(token) && Boolean(applicationId),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useApplicationDetail;
