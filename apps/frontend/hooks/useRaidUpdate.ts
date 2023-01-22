import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useToast } from '@raidguild/design-system';

import { client, RAID_UPDATE_MUTATION } from '../gql';
import { IRaidUpdate, camelize } from '../utils';

const useRaidUpdate = ({ token, raidId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IRaidUpdate) => {
      if (!raidId || !token) return null;
      const result = await client({ token }).request(RAID_UPDATE_MUTATION, {
        id: raidId,
        raid_updates: args.raid_updates,
      });

      return result;
    },
    {
      onSuccess: (data) => {
        const raid = camelize(_.get(data, 'raids_by_pk'));

        queryClient.invalidateQueries(['raidDetail', _.get(raid, 'id')]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList
        queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);

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
