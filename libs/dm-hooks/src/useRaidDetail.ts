import {
  client,
  RAID_BY_V1_ID_QUERY,
  RAID_DETAIL_QUERY,
} from '@raidguild/dm-graphql';
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

    const v2Id = raidId.includes('-');
    const v2IdVariable = { id: raidId };
    const v1IdVariable = { v1Id: raidId };
    const variables = {
      ...(v2Id && v2IdVariable),
      ...(!v2Id && v1IdVariable),
    };

    const result = await client({ token }).request(
      v2Id ? RAID_DETAIL_QUERY : RAID_BY_V1_ID_QUERY,
      variables
    );

    return camelize(
      _.get(result, 'raids_by_pk', _.first(_.get(result, 'raids')))
    );
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
