import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, RAID_DETAIL_QUERY } from '../gql';
import { camelize, IRaid } from '../utils';

const useRaidDetail = ({ raidId, token }) => {
  const raidQueryResult = async () => {
    if (!raidId || !token) return null;
    // TODO handle filters

    const result = await client({ token }).request(RAID_DETAIL_QUERY, {
      id: raidId,
    });

    return camelize(_.get(result, 'raids_by_pk'));
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
