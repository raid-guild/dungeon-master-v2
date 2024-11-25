import { client, CONSULTATION_DETAIL_QUERY } from '@raidguild/dm-graphql';
import { IConsultation } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const useConsultationDetail = ({
  token,
  consultationId,
}: {
  token: string;
  consultationId: string;
}) => {
  const consultationQueryResult = async () => {
    if (!consultationId) return null;
    // TODO handle filters

    const result = await client({ token }).request(CONSULTATION_DETAIL_QUERY, {
      id: consultationId,
    });

    return camelize(_.get(result, 'consultations_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IConsultation,
    Error
  >({
    queryKey: ['consultationDetail', consultationId],
    queryFn: consultationQueryResult,
    enabled: Boolean(token) && Boolean(consultationId),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useConsultationDetail;
