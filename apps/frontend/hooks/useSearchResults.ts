import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { client } from '../gql';
import { SEARCH_QUERY } from '../gql/queries/search';
import { IApplication, IConsultation, IMember, IRaid } from '../types';

const keyIcons = {
  applications: 'UserPlusIcon',
  consultations: 'QueueListIcon',
  members: 'UserGroupIcon',
  raids: 'StarIcon',
};

type searchQueryReturn = Promise<{
  applications: IApplication[];
  consultations: IConsultation[];
  members: IMember[];
  raids: IRaid[];
}> | null;

const processForCommandPalette = (key: string, record: any) => {
  return {
    id: `${key}-${_.get(record, 'id')}`,
    children: _.get(record, 'name'),
    icon: keyIcons[key],
    href: `/${key}/${_.get(record, key === 'members' ? 'eth_address' : 'id')}`,
  };
};

const useSearchResults = ({ token, search }) => {
  const searchQueryResult = async (): searchQueryReturn => {
    if (!search) return null;

    const result = await client(token).query({
      query: SEARCH_QUERY,
      variables: { search: `%${search}%` },
    });

    return _.mapValues(_.get(result, 'data'), (o: any, k: string) => {
      return _.map(_.get(result, `data.${k}`), (r: any) =>
        processForCommandPalette(k, r)
      );
    });
  };

  const { status, error, data, isLoading } = useQuery<any, Error>(
    ['searchResults', search],
    searchQueryResult,
    { enabled: token && !!search }
  );

  return { status, error, data, isLoading };
};

export default useSearchResults;
