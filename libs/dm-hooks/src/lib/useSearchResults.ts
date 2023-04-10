/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { client } from '@raidguild/dm-graphql';
import { SEARCH_QUERY } from '@raidguild/dm-graphql';
import {
  IApplication,
  IConsultation,
  IMember,
  IRaid,
} from '@raidguild/dm-types';

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

const processForCommandPalette = (key: string, record: any) => ({
  id: `${key}-${_.get(record, 'id')}`,
  children: _.get(record, 'name'),
  icon: keyIcons[key],
  href: `/${key}/${_.get(record, key === 'members' ? 'eth_address' : 'id')}`,
});

const useSearchResults = ({ token, search }) => {
  const searchQueryResult = async (): searchQueryReturn => {
    if (!search) return null;

    const result = await client({ token }).request(SEARCH_QUERY, {
      search: `%${search}%`,
    });

    return _.mapValues(result, (o: any, k: string) =>
      _.map(o, (r: any) => processForCommandPalette(k, r))
    );
  };

  const { status, error, data, isLoading } = useQuery<any, Error>(
    ['searchResults', search],
    searchQueryResult,
    { enabled: !!token && !!search }
  );

  return { status, error, data, isLoading };
};

export default useSearchResults;
