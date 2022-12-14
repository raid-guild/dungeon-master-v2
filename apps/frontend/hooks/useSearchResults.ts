import { useState } from 'react';
import { useQuery } from 'react-query';
import _ from 'lodash';
import { client } from '../gql';
import { SEARCH_QUERY } from '../gql/queries/search';
import { IApplication, IConsultation, IMember, IRaid } from '../types';

const useSearchResults = ({ token, search }) => {
  console.log(search);
  // console.log('useSearchResults hook called');

  const [results, setResults] = useState([]);

  type searchQueryReturn = Promise<{
    applications: IApplication[];
    consultations: IConsultation[];
    members: IMember[];
    raids: IRaid[];
  }> | null;

  const searchQueryResult = async (): searchQueryReturn => {
    if (!search) return null;

    const result = await client(token).query({
      query: SEARCH_QUERY,
      variables: { search: `%${search}%` },
    });
    console.log(result);

    const processForCommandPalette = (key, record) => {
      return {
        id: `${key}-${_.get(record, 'id')}`,
        children: _.get(record, 'name'),
        icon: 'HomeIcon',
        href: `/${key}/${_.get(record, 'id')}`,
      };
    };

    return {
      applications: _.map(
        _.get(result, `data.applications`),
        (r: IApplication) => processForCommandPalette('applications', r)
      ),
      consultations: _.map(
        _.get(result, `data.consultations`),
        (r: IConsultation) => processForCommandPalette('consultations', r)
      ),
      members: _.map(_.get(result, `data.members`), (r: IMember) =>
        processForCommandPalette('members', r)
      ),
      raids: _.map(_.get(result, `data.raids`), (r: IRaid) =>
        processForCommandPalette('raids', r)
      ),
    };
  };

  const { status, error, data, isLoading } = useQuery<any, Error>(
    ['searchResults', search],
    searchQueryResult,
    { enabled: token && !!search }
  );

  return { status, error, data, isLoading };
};

export default useSearchResults;
