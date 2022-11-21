import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, CONSULTATION_DETAIL_QUERY } from '../gql';
import { useRouter } from 'next/router';
import { camelize } from '../utils';

const useConsultationDetail = () => {
  const router = useRouter();
  const consultationId = _.get(router, 'query.consultation');
  const { data: session } = useSession();

  const consultationQueryResult = async () => {
    if (!consultationId) return;
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: CONSULTATION_DETAIL_QUERY,
      variables: {
        id: consultationId,
      },
    });

    return camelize(_.get(data, 'consultations_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    ['consultationDetail', consultationId],
    consultationQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useConsultationDetail;
