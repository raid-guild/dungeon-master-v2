import { client, PORTFOLIO_DETAIL_QUERY } from '@raidguild/dm-graphql';
import { useQuery } from '@tanstack/react-query';

interface Props {
  raidId: string;
  token: string; 
}

const usePortfolioDetail = ({ raidId, token }: Props) => {
  // Async function to fetch portfolio details
  const getPortfolioDetail = async () => {
    
      // Ensure both raidId and token are available
      if (!raidId || !token) {
        throw new Error('Missing raidId or token');
      }

      // GraphQL request
      const result = await client({ token }).request(PORTFOLIO_DETAIL_QUERY, {
        where
      });

      return result;
    } 

  // Using useQuery hook from React Query
  const { status, error, data, isLoading } = useQuery(
    ['portfolioDetail', raidId],
    getPortfolioDetail,
    {
      enabled: Boolean(raidId && token), // Query is enabled only if both raidId and token are provided
    },
  );

  return {
    status,
    error,
    data,
    isLoading,
  };
};

export default usePortfolioDetail;
