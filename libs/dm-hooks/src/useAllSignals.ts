import { useToast } from '@raidguild/design-system';
import { ALL_SIGNALS, client } from '@raidguild/dm-graphql';
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ISignal {
  consultation_id?: string;
  id?: string;
  member_id?: string;
  raid_id?: string;
}

const useAllSignals = (token) => {
  const toast = useToast();
  
  const fetchSignals = async () => {
    if ( !token) return null;

    try {
      const result = await client({ token }).request(ALL_SIGNALS);
      return result;
    } catch (error) {
      toast.error({
        title: 'Error fetching Signals',
        description: error.message,
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  const queryKey = ['allSignals', 'signals'];
  const { isLoading, isFetching, isError, error, data } = useQuery(
    queryKey,
    fetchSignals,
    {
      enabled: Boolean(token),
      // add other options like staleTime, cacheTime if needed
    }
  );

  return { isLoading, isFetching, isError, error, data };
};

export default useAllSignals;