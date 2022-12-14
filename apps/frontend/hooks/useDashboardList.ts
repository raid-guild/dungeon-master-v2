import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { DASHBOARD_QUERY, client } from '../gql';
import { camelize } from '../utils';

const ACTIVE_RAID_STATUSES = ['AWAITING', 'PREPARING', 'RAIDING'];

const useDashboardList = ({ token, address }) => {
  const dashboardQueryResult = async () => {
    const result = await client(token).query({
      query: DASHBOARD_QUERY,
      variables: { address },
    });
    console.log(result);

    const resultData = camelize(_.get(result, 'data'));

    const activeRaids = _.filter(_.get(resultData, 'myRaids'), (r) =>
      _.includes(ACTIVE_RAID_STATUSES, _.get(r, 'raidStatus.raidStatus'))
    );
    const pastRaids = _.filter(
      _.get(resultData, 'myRaids'),
      (r) =>
        !_.includes(ACTIVE_RAID_STATUSES, _.get(r, 'raidStatus.raidStatus'))
    );

    return {
      ...resultData,
      myRaids: {
        active: activeRaids,
        past: pastRaids,
      },
    };
  };

  const { data, error, status, isLoading } = useQuery<any>(
    ['dashboard', address],
    dashboardQueryResult,
    { enabled: !!token && !!address }
  );

  return {
    data,
    error,
    status,
    isLoading,
  };
};

export default useDashboardList;
