import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@raidguild/design-system';
import _ from 'lodash';
import { camelize } from '../utils';
import { STATUS_UPDATE_CREATE_MUTATION, client } from '../gql';
import { IStatusUpdate } from '../types';

type useUpdateCreateProps = {
  token: string;
  memberId: string;
};

const useUpdateCreate = ({ token, memberId }: useUpdateCreateProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: Partial<IStatusUpdate>) => {
      console.log(memberId, token);
      if (!memberId || !token) return;
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
    {
      onSuccess: (data) => {
        console.log(data);
        const raid = camelize(_.get(data, 'insert_updates_one.raid'));
        console.log(raid);
        queryClient.setQueryData(
          ['raidDetail', _.get(data, 'insert_updates_one.raid.id')],
          raid
        );
        queryClient.invalidateQueries([
          'raidDetail',
          _.get(data, 'insert_updates_one.raid.id'),
        ]); // invalidate raidDetail

        toast.success({
          title: 'Update added',
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to add Update',
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
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
