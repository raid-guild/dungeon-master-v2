import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { IRip } from '@raidguild/dm-utils';
import axios from 'axios';

// TODO: Change this and /api/rip-detail-query.ts to take pagination params,
// including replacing useQuery with useInfiniteQuery
const useRipList = () => {
  const ripQueryResult = async () => {
    const { data } = await axios.post('/api/rip-detail-query');

    const ripList = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

    const activeRipList = ripList.filter((rip) => {
      return ['Consideration', 'Submitted', 'In Progress'].includes(
        rip.ripCategory
      );
    });

    return activeRipList;
  };

  return useQuery<IRip[], Error>({
    queryKey: ['ripsList'],
    queryFn: () => ripQueryResult(),
  });
};

export default useRipList;

export const useRipsCount = () => {
  const ripsCountQuery = async () => {
    const { data } = await axios.post('/api/rip-detail-query');

    const ripList = _.flatMap(
      data.data.repository.project.columns.nodes,
      (node) => {
        return _.map(node.cards.edges, (edge) => {
          return { ...edge.node.content, ripCategory: node.name };
        });
      }
    );

    const activeRipList = ripList.filter((rip) => {
      return ['Consideration', 'Submitted', 'In Progress'].includes(
        rip.ripCategory
      );
    });

    return activeRipList.length;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['ripsCount'],
    queryFn: () => ripsCountQuery(),
  });

  return {
    data,
    isLoading,
    error,
  };
};
