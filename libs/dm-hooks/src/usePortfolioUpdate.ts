import { useToast } from '@raidguild/design-system';
import { client, PORTFOLIO_INSERT_MUTATION, PORTFOLIO_UPDATE_MUTATION } from '@raidguild/dm-graphql';
import { IPortfolioUpdate } from '@raidguild/dm-types';
import { useMutation } from '@tanstack/react-query';

const usePortfolioUpdate = (token: string, portfolioId?: string) => {
  const toast = useToast();

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
        console.log('success', data);
        setTimeout(() => {
          toast.success({
            title: 'Portfolio Edited Successfully',
            duration: 3000,
            isClosable: true,
          });
        }, 1000);
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
