import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, MEMBER_UPDATE_MUTATION } from '../gql';
import { useToast } from '@raidguild/design-system';
import { IMemberUpdate } from '../utils';

const useMemberUpdate = ({ token, memberId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IMemberUpdate) => {
      if (!memberId || !token) return;
      const result = await client({ token }).request(MEMBER_UPDATE_MUTATION, {
        id: memberId,
        member_updates: args.member_updates,
        contact_info_pk: args.contact_info_id,
        contact_info_updates: args.contact_info_updates,
      });

      return result;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([
          'memberDetail',
          data.update_members_by_pk?.eth_address,
        ]); // invalidate memberDetail with eth_address (used in the query) from the successful mutation response
        queryClient.invalidateQueries(['memberList']); // invalidate the memberList

        toast.success({
          title: 'Member Info Updated',
          iconName: 'crown',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Member',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useMemberUpdate;
