import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, CONSULTATION_DETAIL_QUERY } from '../gql';
import { useRouter } from 'next/router';
import { camelize, IConsultation } from '../utils';

const useConsultationDetail = ({ token }) => {
  const router = useRouter();
  const consultationId = _.get(router, 'query.consultation');

  const consultationQueryResult = async () => {
    if (!consultationId) return;
    // TODO handle filters

    const { data } = await client(token).query({
      query: CONSULTATION_DETAIL_QUERY,
      variables: {
        id: consultationId,
      },
    });

    return camelize(_.get(data, 'consultations_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IConsultation,
    Error
  >(['consultationDetail', consultationId], consultationQueryResult, {
    enabled: Boolean(token),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useConsultationDetail;
