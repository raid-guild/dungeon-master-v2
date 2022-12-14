import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, MEMBER_UPDATE_MUTATION } from '../gql';
import { useToast } from '@raidguild/design-system';
import { IMember } from '../utils';

const useMemberUpdate = ({ token, memberId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IMember) => {
      console.log('args', args);
      if (!memberId || !token) return;
      const { data } = await client(token).mutate({
        mutation: MEMBER_UPDATE_MUTATION,
        variables: {
          id: memberId,
          member_updates: args,
        },
      });

      return { data };
    },
    {
      onSuccess: (data) => {
        console.log('success', data);
        queryClient.invalidateQueries([
          'memberDetail',
          data?.data.update_members_by_pk?.eth_address,
        ]); // invalidate memberDetail with eth_address (used in the query) from the successful mutation response
        queryClient.invalidateQueries(['memberList']); // invalidate the memberList

        toast({
          title: 'Member Info Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: 'Unable to Update Member',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useMemberUpdate;
