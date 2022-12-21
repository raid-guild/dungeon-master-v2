import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, RAID_DETAIL_QUERY } from '../gql';
import { camelize, IRaid } from '../utils';

const useRaidDetail = ({ raidId, token }) => {
  console.log(raidId, token);
  const raidQueryResult = async () => {
    console.log('here');
    if (!raidId || !token) return;
    // TODO handle filters

    const { data } = await client(token).query({
      query: RAID_DETAIL_QUERY,
      variables: {
        id: raidId,
      },
    });

    return camelize(_.get(data, 'raids_by_pk'));
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    IRaid,
    Error
  >({
    queryKey: ['raidDetail', raidId],
    queryFn: raidQueryResult,

    enabled: Boolean(token) && Boolean(raidId),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useRaidDetail;
