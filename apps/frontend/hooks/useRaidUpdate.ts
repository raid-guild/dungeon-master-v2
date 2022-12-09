import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, RAID_UPDATE_MUTATION } from '../gql';
import { useToast } from '@raidguild/design-system';
import { RaidUpdateType } from '../utils';

const useRaidUpdate = ({ token, raidId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: RaidUpdateType) => {
      console.log('args', args);
      if (!raidId || !token) return;
      const { data } = await client(token).mutate({
        mutation: RAID_UPDATE_MUTATION,
        variables: {
          id: raidId,
          ...args,
        },
      });

      return { data };
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([
          'raidDetail',
          data?.data.update_raids_by_pk?.id,
        ]); // invalidate raidDetail with id from the successful mutation response
        // queryClient.invalidateQueries(['raidDetail']);
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList

        toast({
          title: 'Status Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: 'Unable to Update Raid',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useRaidUpdate;
