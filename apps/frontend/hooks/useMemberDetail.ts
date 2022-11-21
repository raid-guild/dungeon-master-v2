import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, MEMBER_ADDRESS_LOOKUP_QUERY } from '../gql';
import { camelize } from '../utils';

const useMemberDetail = () => {
  const router = useRouter();
  const memberAddress = _.get(router, 'query.member');
  const { data: session } = useSession();

  const memberQueryResult = async () => {
    if (!memberAddress) return;
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: MEMBER_ADDRESS_LOOKUP_QUERY,
      variables: {
        address: memberAddress,
      },
    });

    return camelize(_.first(_.get(data, 'members')));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    ['memberDetail', memberAddress],
    memberQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useMemberDetail;
