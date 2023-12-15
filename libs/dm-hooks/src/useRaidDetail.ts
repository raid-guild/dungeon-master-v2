import { client, RAID_DETAIL_QUERY } from '@raidguild/dm-graphql';
import { IRaid } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import _ from 'lodash';

const useRaidDetail = ({
  raidId,
  token,
  roles,
}: {
  raidId: string;
  token: string;
  roles: string[];
}) => {
  const raidQueryResult = async () => {
    if (!raidId || !token) return null;
    // TODO handle filters
    if (!_.includes(roles, 'member')) {
      const result = await axios.post('/api/validate', { raidId });

      return camelize(_.get(result, 'data'));
    }

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
