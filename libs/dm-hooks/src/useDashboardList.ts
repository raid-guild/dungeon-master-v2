import { client, DASHBOARD_QUERY } from '@raidguild/dm-graphql';
import { IRaid } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const ACTIVE_RAID_STATUSES = ['AWAITING', 'PREPARING', 'RAIDING'];

const useDashboardList = ({
  token,
  role,
  address,
}: {
  token: string;
  role: string;
  address: string;
}) => {
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
    { enabled: !!token && !!address && role === 'member' }
  );

  return {
    data,
    error,
    status,
    isLoading,
  };
};

export default useDashboardList;
