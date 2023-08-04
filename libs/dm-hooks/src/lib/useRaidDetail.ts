import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, RAID_DETAIL_QUERY } from '@raidguild/dm-graphql';
import { camelize, IRaid } from '@raidguild/dm-utils';

const useRaidDetail = ({ raidId, token }: { raidId: string, token: string }) => {
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
