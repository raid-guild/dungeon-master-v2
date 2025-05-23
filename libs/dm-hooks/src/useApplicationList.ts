import {
  APPLICATION_LIST_QUERY,
  APPLICATIONS_LIST_COUNT_QUERY,
  client,
} from '@raidguild/dm-graphql';
import { IApplication } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

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
    applications_skills: {
      skill: {
        skill: { _in: applicationSkillFilterKey },
      },
    },
  }),
});

const orderBy = (applicationSortKey: string) => ({
  ...(applicationSortKey === 'name' && {
    name: 'asc',
  }),
  ...(applicationSortKey === 'createdAt' && {
    created_at: 'desc',
  }),
});

type applicationListType = {
  token: string;
  applicationSkillTypeFilterKey?: string;
  applicationSkillFilterKey?: string;
  applicationSortKey: string;
};

const useApplicationList = ({
  token,
  applicationSkillTypeFilterKey = 'ALL',
  applicationSkillFilterKey = 'ALL',
  applicationSortKey = 'name',
}: applicationListType) => {
  const limit = 15;

  const applicationQueryResult = async (pageParam: number) => {
    if (!token) return null;

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
  } = useInfiniteQuery<Array<Array<IApplication>>, Error>({
    queryKey: [
      'applicationList',
      applicationSkillTypeFilterKey,
      applicationSkillFilterKey,
      applicationSortKey,
    ],
    initialPageParam: 1,
    queryFn: (pageParam) =>
      applicationQueryResult(pageParam as unknown as number),
    getNextPageParam: (lastPage, allPages) =>
      _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), limit),
    enabled: Boolean(token),
  });

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

type applicationCountType = {
  token: string;
  applicationSkillTypeFilterKey?: string;
  applicationSkillFilterKey?: string;
};

export const useApplicationsCount = ({
  token,
  applicationSkillTypeFilterKey = 'ALL',
  applicationSkillFilterKey = 'ALL',
}: applicationCountType) => {
  const applicationsCountQuery = async () => {
    const result = await client({ token }).request(
      APPLICATIONS_LIST_COUNT_QUERY,
      {
        where: where(applicationSkillTypeFilterKey, applicationSkillFilterKey),
      }
    );

    return _.get(result, 'applications_aggregate.aggregate.count', 0);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'applicationsCount',
      applicationSkillTypeFilterKey,
      applicationSkillFilterKey,
    ],
    queryFn: applicationsCountQuery,
    enabled: Boolean(token),
  });

  return { data, isLoading, error };
};
