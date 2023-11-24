/* eslint-disable @typescript-eslint/no-explicit-any */
import { client, SEARCH_QUERY } from '@raidguild/dm-graphql';
// import {
//   IApplication,
//   IConsultation,
//   IMember,
//   IRaid,
// } from '@raidguild/dm-types';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const keyIcons: { [key: string]: string } = {
  applications: 'UserPlusIcon',
  consultations: 'QueueListIcon',
  members: 'UserGroupIcon',
  raids: 'StarIcon',
};

type searchResultType = {
  id: string;
  children: string;
  icon: string;
  href: string;
} | null;

type searchQueryReturn = Promise<{
  [key: string]: searchResultType[];
} | null>;

const processForCommandPalette = (key: string, record: any) => ({
  id: `${key}-${_.get(record, 'id')}`,
  children: _.get(record, 'name'),
  icon: keyIcons[key],
  href: `/${key}/${_.get(record, key === 'members' ? 'eth_address' : 'id')}`,
});

const useSearchResults = ({
  token,
  search,
}: {
  token: string;
  search: string;
}) => {
  const searchQueryResult = async (): searchQueryReturn => {
    if (!search) return null;

    const result: any = await client({ token }).request(SEARCH_QUERY, {
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
