import { useToast } from '@raidguild/design-system';
import {
  client,
  RAID_MINI_UPDATE_MUTATION,
  RAID_UPDATE_MUTATION,
} from '@raidguild/dm-graphql';
import { IConsultationUpdate, IRaidUpdate } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';

const useRaidUpdate = ({
  token,
  raidId,
  consultationId,
}: {
  token: string;
  raidId: string;
  consultationId?: string;
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (args: IRaidUpdate & Partial<IConsultationUpdate>) => {
      if (!raidId || !token) return null;

      let result;

      if (!consultationId && raidId) {
        result = await client({ token }).request(RAID_MINI_UPDATE_MUTATION, {
          id: raidId,
          raid_updates: args.raid_updates,
        });
      } else {
        result = await client({ token }).request(RAID_UPDATE_MUTATION, {
          id: raidId,
          raid_updates: args.raid_updates,
          consultation_id: consultationId,
          consultation_updates: args.consultation_updates,
        });
      }

      return result;
    },
    onSuccess: (data) => {
      const raid = camelize(
        _.get(data, 'raids_by_pk', _.get(data, 'update_raids_by_pk'))
      );

      queryClient.invalidateQueries({
        queryKey: ['consultationDetail', _.get(data, 'id')],
      });
      queryClient.invalidateQueries({ queryKey: ['consultationList'] });
      queryClient.setQueryData(
        ['consultationDetail', _.get(data, 'id')],
        camelize(data)
      );
      queryClient.invalidateQueries({
        queryKey: ['raidDetail', _.get(raid, 'id')],
      }); // invalidate raidDetail with id from the successful mutation response
      queryClient.invalidateQueries({ queryKey: ['raidList'] }); // invalidate the raidList
      queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);

      toast.success({
        title: 'Raid Updated',
        iconName: 'crown',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      toast.error({
        title: 'Unable to Update Raid',
        iconName: 'alert',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { mutateAsync, isPending, isError, isSuccess };
};

export default useRaidUpdate;
