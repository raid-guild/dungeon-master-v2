import { useToast } from '@raidguild/design-system';
import { client, PORTFOLIO_INSERT_MUTATION, PORTFOLIO_UPDATE_MUTATION } from '@raidguild/dm-graphql';
import { IPortfolioUpdate } from '@raidguild/dm-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const usePortfolioUpdate = (initArgs: {token: string, portfolioId?: string}) => {
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

  const { mutate, mutateAsync, isLoading, isError, isSuccess } = useMutation(
    portfolioMutation,
    {
      onSuccess: (data) => {

          queryClient.invalidateQueries(['consultationList']);
          queryClient.invalidateQueries(['raidList']);
          queryClient.invalidateQueries(['memberList']);
          queryClient.invalidateQueries(['consultationDetail']);
          queryClient.invalidateQueries(['raidDetail']);
          queryClient.invalidateQueries(['memberDetail']);

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
    },
  );

  return { mutate, mutateAsync, isLoading, isError, isSuccess };
};

export default usePortfolioUpdate;
