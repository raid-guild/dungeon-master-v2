import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, CONSULTATION_LIST_QUERY } from '../gql';

const useConsultationList = () => {
  const { data: session } = useSession();

  const consultationQueryResult = async () => {
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: CONSULTATION_LIST_QUERY,
    });

    return _.get(data, 'consultations');
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    'consultationList',
    consultationQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useConsultationList;
