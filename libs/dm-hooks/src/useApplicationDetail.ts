import { APPLICATION_DETAIL_QUERY, client } from '@raidguild/dm-graphql';
import { IApplication } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const useApplicationDetail = ({
  token,
  applicationId,
}: {
  token?: string;
  applicationId?: string;
}) => {
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
