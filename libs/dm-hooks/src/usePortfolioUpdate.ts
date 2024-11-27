import { useToast } from '@raidguild/design-system';
import {
  client,
  PORTFOLIO_INSERT_MUTATION,
  PORTFOLIO_UPDATE_MUTATION,
} from '@raidguild/dm-graphql';
import { IPortfolioUpdate } from '@raidguild/dm-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const usePortfolioUpdate = (initArgs: {
  token: string;
  portfolioId?: string;
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { token, portfolioId } = initArgs;
  // Separate function for mutation logic
  const portfolioMutation = async (args: IPortfolioUpdate) => {
    if (portfolioId) {
      return client({ token }).request(PORTFOLIO_UPDATE_MUTATION, {
        portfolio_id: portfolioId,
        portfolio: args.portfolio,
      });
    }
    return client({ token }).request(PORTFOLIO_INSERT_MUTATION, {
      portfolio: args.portfolio,
    });
  };

  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: portfolioMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultationList'] });
      queryClient.invalidateQueries({ queryKey: ['raidList'] });
      queryClient.invalidateQueries({ queryKey: ['memberList'] });
      queryClient.invalidateQueries({ queryKey: ['consultationDetail'] });
      queryClient.invalidateQueries({ queryKey: ['raidDetail'] });
      queryClient.invalidateQueries({ queryKey: ['memberDetail'] });

      toast.success({
        title: 'Raid Updated',
        iconName: 'crown',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast.error({
        title: 'Error Updating Portfolio',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return { mutate, mutateAsync, isPending, isError, isSuccess };
};

export default usePortfolioUpdate;
