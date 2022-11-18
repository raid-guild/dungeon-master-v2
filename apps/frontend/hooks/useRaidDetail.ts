import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { client, RAID_DETAIL_QUERY } from '../gql';
import { useRouter } from 'next/router';

const useRaidDetail = () => {
  const router = useRouter();
  const raidId = _.get(router, 'query.raid');
  const { data: session } = useSession();

  const raidQueryResult = async () => {
    if (!raidId) return;
    // TODO handle filters

    const { data } = await client(_.get(session, 'token')).query({
      query: RAID_DETAIL_QUERY,
      variables: {
        id: raidId,
      },
    });

    return _.get(data, 'raids_by_pk');
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<any, Error>(
    ['raidDetail', raidId],
    raidQueryResult
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useRaidDetail;
