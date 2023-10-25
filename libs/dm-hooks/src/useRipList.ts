import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { IRip, RIP_STATUS, ripSortKeys } from '@raidguild/dm-utils';
import axios from 'axios';

type RipListType = {
  ripStatusFilterKey: string;
  ripSortKey: ripSortKeys;
};

// TODO: Change this and /api/rip-detail-query.ts to take pagination params,
// including replacing useQuery with useInfiniteQuery
const useRipList = ({ ripStatusFilterKey, ripSortKey }: RipListType) => {
  const ripQueryResult = async (ripStatusFilterKey, ripSortKey) => {
    const { data } = await axios.post('/api/rip-detail-query');

    const fullRipList: IRip[] = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

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

    const filteredRipList = fullRipList.filter((rip) => {
      return ripListFilter.includes(rip.ripCategory);
    });

    return filteredRipList;
  };

  return useQuery<IRip[], Error>({
    queryKey: ['ripsList', ripStatusFilterKey, ripSortKey],
    queryFn: () => ripQueryResult(ripStatusFilterKey, ripSortKey),
  });
};

export default useRipList;

export const useRipsCount = ({
  ripStatusFilterKey,
  ripSortKey,
}: RipListType) => {
  const ripsCountQuery = async (ripStatusFilterKey, ripSortKey) => {
    const { data } = await axios.post('/api/rip-detail-query');

    const fullRipList: IRip[] = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

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

    const filteredRipList = fullRipList.filter((rip) => {
      return ripListFilter.includes(rip.ripCategory);
    });

    return filteredRipList.length;
  };

  const { data, isLoading, error } = useQuery<number, Error>({
    queryKey: ['ripsCount', ripStatusFilterKey, ripSortKey],
    queryFn: () => ripsCountQuery(ripStatusFilterKey, ripSortKey),
  });

  return {
    data,
    isLoading,
    error,
  };
};
