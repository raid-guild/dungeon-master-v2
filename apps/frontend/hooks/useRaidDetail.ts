import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, RAID_DETAIL_QUERY } from '../gql';
import { useRouter } from 'next/router';
import { camelize, IRaid } from '../utils';

const useRaidDetail = ({ token }) => {
  const router = useRouter();
  const raidId = _.get(router, 'query.raid');

  const raidQueryResult = async () => {
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
  >(['raidDetail', raidId], raidQueryResult, { enabled: Boolean(token) });

  return { isLoading, isFetching, isError, error, data };
};

export default useRaidDetail;
