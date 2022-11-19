import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, MEMBER_LIST_QUERY } from '../gql';

const useMemberList = () => {
  const { data: session } = useSession();

  const memberQueryResult = async () => {
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: MEMBER_LIST_QUERY,
      variables: {},
    });

    return _.get(data, 'members');
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    'memberList',
    memberQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useMemberList;
