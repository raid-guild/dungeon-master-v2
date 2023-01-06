import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { client, RAID_UPDATE_MUTATION } from '../gql';
import { useToast } from '@raidguild/design-system';
import { IRaidUpdate } from '../utils';

const useRaidUpdate = ({ token, raidId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IRaidUpdate) => {
      if (!raidId || !token) return;
      const { data } = await client(token).mutate({
        mutation: RAID_UPDATE_MUTATION,
        variables: {
          id: raidId,
          raid_updates: args.raid_updates,
        },
      });

      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries([
          'raidDetail',
          _.get(data, 'update_raids_by_pk.id'),
        ]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList
        queryClient.setQueryData(
          ['raidDetail', _.get(data, 'update_raids_by_pk.id')],
          _.get(data, 'update_raids_by_pk')
        );

        toast.success({
          title: 'Raid Updated',
          iconName: 'crown',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Raid',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useRaidUpdate;
