import _ from 'lodash';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, RAID_UPDATE_MUTATION } from '../gql';
import { useToast } from '@raidguild/design-system';

const useRaidUpdate = ({ token }) => {
  const router = useRouter();
  const raidId = _.get(router, 'query.raid');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate, isLoading, isError, isSuccess } = useMutation(
    async () => {
      console.log('firing update', raidId);
      console.log('token', token);
      if (!raidId || !token) return;
      const { data } = await client(token).mutate({
        mutation: RAID_UPDATE_MUTATION,
        variables: {
          id: raidId,
          status: 'PREPARING',
        },
      });
      console.log('data', data);
      return { data };
    },
    {
      onSuccess: (data) => {
        console.log('update success', data);
        toast({
          title: 'Status Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        console.log('update error', error);
        toast({
          title: 'Unable to Update Status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutate, isLoading, isError, isSuccess };
};

export default useRaidUpdate;
