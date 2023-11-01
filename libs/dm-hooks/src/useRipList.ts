import _ from 'lodash';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IRip, RIP_STATUS, ripSortKeys } from '@raidguild/dm-utils';
import axios from 'axios';

type RipListType = {
  ripStatusFilterKey: string;
  ripSortKey: ripSortKeys;
};

const useRipList = ({ ripStatusFilterKey, ripSortKey }: RipListType) => {
  const limit = 15;
  const ripListFilter = (() => {
    switch (ripStatusFilterKey) {
      case 'ACTIVE':
        return ['Consideration', 'Submitted', 'In Progress'];
      case 'ALL':
        return RIP_STATUS;
      default:
        return [_.startCase(_.toLower(ripStatusFilterKey))];
    }
  })();

  const ripQueryResult = async (pageParam: number) => {
    const { data } = await axios.post('/api/rip-detail-query');

    const fullRipList: IRip[] = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

    const filteredRipList = fullRipList.filter((rip) => {
      return ripListFilter.includes(rip.ripCategory);
    });

    const sortedRipList = (() => {
      switch (ripSortKey) {
        case 'oldestComment':
          return _.sortBy(filteredRipList, (rip) => {
            const lastComment = _.last(_.get(rip, 'comments.nodes'));
            return _.get(lastComment, 'createdAt');
          });
        case 'recentComment':
          const oldestCommentRipList = _.sortBy(filteredRipList, (rip) => {
            const lastComment = _.last(_.get(rip, 'comments.nodes'));
            return _.get(lastComment, 'createdAt');
          });
          const recentCommentRipList = oldestCommentRipList.reverse();
          const sortedRipListWithComments = recentCommentRipList.filter(
            (rip) => {
              return _.get(rip, 'comments.nodes.length', 0) > 0;
            }
          );
          const sortedRipListWithoutComments = recentCommentRipList.filter(
            (rip) => {
              return _.get(rip, 'comments.nodes.length', 0) === 0;
            }
          );
          const recentCommentCorrectlySortedRipList = [
            ...sortedRipListWithComments,
            ...sortedRipListWithoutComments,
          ];
          return recentCommentCorrectlySortedRipList;
        case 'name':
          return _.sortBy(filteredRipList, (rip) => _.toLower(rip.title));
        case 'createdDate':
          return _.sortBy(filteredRipList, (rip) => rip.createdAt).reverse();
        case 'status':
          return filteredRipList;
        default:
          return filteredRipList;
      }
    })();

    const paginatedRipList = _.slice(
      sortedRipList,
      pageParam * limit,
      (pageParam + 1) * limit
    );

    return paginatedRipList;
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<IRip>, Error>({
    queryKey: ['ripsList', ripStatusFilterKey, ripSortKey],
    queryFn: ({ pageParam = 0 }) => ripQueryResult(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), limit),
  });

  return {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
  };
};

export default useRipList;

export const useRipsCount = ({
  ripStatusFilterKey,
  ripSortKey,
}: RipListType) => {
  const ripListFilter = (() => {
    switch (ripStatusFilterKey) {
      case 'ACTIVE':
        return ['Consideration', 'Submitted', 'In Progress'];
      case 'ALL':
        return RIP_STATUS;
      default:
        return [_.startCase(_.toLower(ripStatusFilterKey))];
    }
  })();

  const ripsCountQuery = async () => {
    const { data } = await axios.post('/api/rip-detail-query');

    const fullRipList: IRip[] = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

    const filteredRipList = fullRipList.filter((rip) => {
      return ripListFilter.includes(rip.ripCategory);
    });

    return filteredRipList.length;
  };

  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: ['ripsCount', ripStatusFilterKey, ripSortKey],
    queryFn: ripsCountQuery,
  });

  return {
    data,
    isLoading,
    error,
  };
};
