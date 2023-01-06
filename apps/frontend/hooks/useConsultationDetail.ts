import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, CONSULTATION_DETAIL_QUERY } from '../gql';
import { camelize, IConsultation } from '../utils';

const useConsultationDetail = ({ token, consultationId }) => {
  const consultationQueryResult = async () => {
    if (!consultationId) return;
    // TODO handle filters

    const result = await client({ token }).request(CONSULTATION_DETAIL_QUERY, {
      id: consultationId,
    });

    return camelize(_.get(result, 'consultations_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IConsultation,
    Error
  >(['consultationDetail', consultationId], consultationQueryResult, {
    enabled: Boolean(token) && Boolean(consultationId),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useConsultationDetail;
