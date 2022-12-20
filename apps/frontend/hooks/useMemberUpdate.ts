import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, MEMBER_UPDATE_MUTATION } from '../gql';
import { useCustomToast } from '@raidguild/design-system';
import { IMemberUpdate } from '../utils';

const useMemberUpdate = ({ token, memberId }) => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IMemberUpdate) => {
      if (!memberId || !token) return;
      const { data } = await client(token).mutate({
        mutation: MEMBER_UPDATE_MUTATION,
        variables: {
          id: memberId,
          member_updates: args.member_updates,
          contact_info_pk: args.contact_info_id,
          contact_info_updates: args.contact_info_updates,
        },
      });

      return { data };
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([
          'memberDetail',
          data?.data.update_members_by_pk?.eth_address,
        ]); // invalidate memberDetail with eth_address (used in the query) from the successful mutation response
        queryClient.invalidateQueries(['memberList']); // invalidate the memberList

        toast.success({
          title: 'Member Info Updated',
          status: 'success',
          iconName: 'crown',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Member',
          status: 'error',
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
