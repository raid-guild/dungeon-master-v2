import { useToast } from '@raidguild/design-system';
import { client, STATUS_UPDATE_CREATE_MUTATION } from '@raidguild/dm-graphql';
import { IStatusUpdate } from '@raidguild/dm-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';

type useUpdateCreateProps = {
  token: string;
  memberId: string;
};

const useUpdateCreate = ({ token, memberId }: useUpdateCreateProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: async ({ ...args }: Partial<IStatusUpdate>) => {
      if (!memberId || !token) return null;
      const result = await client({ token }).request(
        STATUS_UPDATE_CREATE_MUTATION,
        {
          update: {
            update: args.update,
            raid_id: args.raidId,
            member_id: memberId,
            // TODO reply_to
          },
        }
      );

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['raidDetail', _.get(data, 'insert_updates_one.raid.id')],
      }); // invalidate raidDetail

      toast.success({
        title: 'Update added',
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      toast.error({
        title: 'Unable to add Update',
      });
    },
  });
  return { mutateAsync, isPending, isError, isSuccess };
};

// if ('update' in result) {
//   toast({
//     title: 'Raid Updated',
//     description: 'Your update has been recorded.',
//     status: 'success',
//     duration: 3000,
//     isClosable: true,
//   });
//   setAddupdate(false);
//   // TODO update update feed inline
//   // router.push(`/raids/[id]`, `/raids/${raidId}`);
//   updateRaid('updates', [
//     ...updates,
//     {
//       ...result,
//       createdAt: new Date(result.createdAt),
//       updateedBy: userData.member,
//     },
//   ]);
// }

export default useUpdateCreate;
