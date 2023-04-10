import _ from 'lodash';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  client,
  CONSULTATION_LIST_QUERY,
  CONSULTATIONS_COUNT_QUERY,
} from '@raidguild/dm-graphql';
import { camelize, IConsultation } from '@raidguild/dm-utils';

type consultationSortKeys = 'name' | 'recentlyAdded';

const where = (
  consultationTypeFilterKey: string,
  consultationSubmissionFilterKey: string,
  consultationBudgetFilterKey: string
) => ({
  _and: {
    _not: { raids: {} },
    consultation_status_key: { _neq: 'CANCELLED' },
    ...(consultationTypeFilterKey !== 'ALL' && {
      project_type: { project_type: { _eq: consultationTypeFilterKey } },
    }),
    ...(consultationBudgetFilterKey !== 'ALL' && {
      budget_option: {
        budget_option: { _eq: consultationBudgetFilterKey },
      },
    }),
    ...(consultationSubmissionFilterKey !== 'ALL' && {
      submission_type: {
        submission_type: { _eq: consultationSubmissionFilterKey },
      },
    }),
  },
});

const orderBy = (consultationSortKey: consultationSortKeys) => ({
  ...(consultationSortKey === 'name' && {
    name: 'asc',
  }),
  ...(consultationSortKey === 'recentlyAdded' && {
    created_at: 'desc',
  }),
});

const useConsultationList = ({
  token,
  consultationTypeFilterKey = 'ALL',
  consultationSubmissionFilterKey = 'ALL',
  consultationBudgetFilterKey = 'ALL',
  consultationSortKey,
}) => {
  const limit = 15;
  const consultationQueryResult = async (pageParam: number) => {
    if (!token) return null;

    const result = await client({ token }).request(CONSULTATION_LIST_QUERY, {
      limit,
      offset: pageParam * limit,
      where: where(
        consultationTypeFilterKey,
        consultationSubmissionFilterKey,
        consultationBudgetFilterKey
      ),
      order_by: orderBy(consultationSortKey),
    });

    return camelize(_.get(result, 'consultations'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IConsultation>>, Error>(
    [
      'consultationList',
      consultationTypeFilterKey,
      consultationBudgetFilterKey,
      consultationSubmissionFilterKey,
      consultationSortKey,
    ],
    ({ pageParam = 0 }) => consultationQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) =>
        _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit),
      enabled: Boolean(token),
    }
  );

  return {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useConsultationList;

export const useConsultationsCount = ({
  token,
  consultationTypeFilterKey,
  consultationSubmissionFilterKey,
  consultationBudgetFilterKey,
}) => {
  const consultationsCountQuery = async () => {
    const result = await client({ token }).request(CONSULTATIONS_COUNT_QUERY, {
      where: where(
        consultationTypeFilterKey,
        consultationBudgetFilterKey,
        consultationSubmissionFilterKey
      ),
    });

    return _.get(result, 'consultations_aggregate.aggregate.count', 0);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'consultationsCount',
      consultationTypeFilterKey,
      consultationBudgetFilterKey,
      consultationSubmissionFilterKey,
    ],
    queryFn: consultationsCountQuery,
    enabled: Boolean(token),
  });

  return { data, isLoading, error };
};
