import { useQuery } from 'react-query';
import _ from 'lodash';
import { DASHBOARD_QUERY, client } from '../gql';
import { camelize } from '../utils';

const useDashboardList = ({ token, address }) => {
  const dashboardQueryResult = async () => {
    const result = await client(token).query({
      query: DASHBOARD_QUERY,
      variables: { address },
    });

    return camelize(_.get(result, 'data'));
  };

  const { data, error, status, isLoading } = useQuery<any>(
    'dashboard',
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
