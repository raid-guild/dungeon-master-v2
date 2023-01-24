import _ from 'lodash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, APPLICATION_LIST_QUERY } from '../gql';
import { camelize, IApplication } from '../utils';

const where = (
  applicationSkillTypeFilterKey: string,
  applicationSkillFilterKey: string
) => ({
  _not: { member: {} },
  ...(applicationSkillTypeFilterKey !== 'ALL' && {
    technical_skill_type: {
      skill_type: { _eq: applicationSkillTypeFilterKey },
    },
  }),
  ...(applicationSkillFilterKey !== 'ALL' && {
    applications_skills: { skill: { skill: { _in: 'UX_RESEARCH' } } },
  }),
  // ...(applicationSkillFilterKey !== 'ALL' && {
  //   application_skills: {
  //     skill: {
  //       skill: { _in: applicationSkillFilterKey },
  //     },
  //   },
  // }),
});

const orderBy = (applicationSortKey: string) => ({
  ...(applicationSortKey === 'name' && {
    name: 'asc',
  }),
  ...(applicationSortKey === 'createdAt' && {
    created_at: 'desc',
  }),
});

const useApplicationList = ({
  token,
  applicationSkillTypeFilterKey = 'ALL',
  applicationSkillFilterKey,
  applicationSortKey = 'name',
}) => {
  const limit = 15;

  console.log('applicationSkillFilterKey', applicationSkillFilterKey);

  const applicationQueryResult = async (pageParam: number) => {
    if (!token) return;

    const result = await client({ token }).request(APPLICATION_LIST_QUERY, {
      limit,
      offset: pageParam * limit,
      where: where(applicationSkillTypeFilterKey, applicationSkillFilterKey),
      order_by: orderBy(applicationSortKey),
    });

    return camelize(_.get(result, 'applications'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IApplication>>, Error>(
    [
      'applicationList',
      applicationSkillTypeFilterKey,
      applicationSkillFilterKey,
      applicationSortKey,
    ],
    ({ pageParam = 0 }) => applicationQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit);
      },
      enabled: Boolean(token),
    }
  );

  return {
    status,
    error,
    data,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useApplicationList;
