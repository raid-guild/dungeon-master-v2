import { useRouter } from 'next/router';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, MEMBER_ADDRESS_LOOKUP_QUERY } from '../gql';
import { camelize, IMember } from '../utils';

const useMemberDetail = ({ token }) => {
  const router = useRouter();
  const memberAddress = _.get(router, 'query.member');

  const memberQueryResult = async () => {
    if (!memberAddress || !token) return;
    // TODO handle filters

    const { data } = await client(token).query({
      query: MEMBER_ADDRESS_LOOKUP_QUERY,
      variables: {
        address: memberAddress,
      },
    });

    return camelize(_.first(_.get(data, 'members')));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IMember,
    Error
  >(['memberDetail', memberAddress], memberQueryResult, {
    enabled: Boolean(token),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useMemberDetail;
