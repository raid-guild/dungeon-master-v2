/* eslint-disable import/prefer-default-export */
import { ALL_CONTACTS_QUERY, client } from '@raidguild/dm-graphql';
import { camelize } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';

export const useContacts = ({ token }: { token: string }) => {
  const { data, error, status, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await client({ token }).request(ALL_CONTACTS_QUERY);
      return camelize(result);
    },
  });

  return {
    data,
    error,
    status,
    isLoading,
  };
};
