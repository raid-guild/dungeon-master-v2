import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { DASHBOARD_QUERY, client } from '@raidguild/dm-graphql';
import { camelize, IRaid } from '@raidguild/dm-utils';

const ACTIVE_RAID_STATUSES = ['AWAITING', 'PREPARING', 'RAIDING'];

const useDashboardList = ({ token, address }) => {
  const dashboardQueryResult = async () => {
    const result = await client({ token }).request(DASHBOARD_QUERY, {
      address: _.toLower(address),
    });

    const resultData = camelize(result);

    const raids = _.concat(
      _.get(resultData, 'raidPartyRaids'),
      _.get(resultData, 'clericRaids')
    );
    const uniqueRaids = _.uniqBy(raids, 'id');

    const activeRaids = _.filter(uniqueRaids, (r: IRaid) =>
      _.includes(ACTIVE_RAID_STATUSES, _.get(r, 'raidStatus.raidStatus'))
    );
    const pastRaids = _.filter(
      uniqueRaids,
      (r: IRaid) =>
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

  const { data, error, status, isLoading } = useQuery(
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
