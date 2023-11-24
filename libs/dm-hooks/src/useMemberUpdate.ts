import { useToast } from '@raidguild/design-system';
import { client, MEMBER_UPDATE_MUTATION } from '@raidguild/dm-graphql';
import { IMemberUpdate } from '@raidguild/dm-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type MemberUpdateType = {
  token: string;
  memberId: string;
  memberAddress: string;
};
const useMemberUpdate = ({
  token,
  memberId,
  memberAddress,
}: MemberUpdateType) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IMemberUpdate) => {
      if (!memberId || !token) return null;
      const result = await client({ token }).request(MEMBER_UPDATE_MUTATION, {
        id: memberId,
        member_updates: args.member_updates,
        contact_info_pk: args.contact_info_id,
        contact_info_updates: args.contact_info_updates,
      });

      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['memberDetail', memberAddress]); // invalidate memberDetail with eth_address (used in the query) from the successful mutation response. should be the same as the memberAddress passed in to ensure consistency due to the lowercase
        queryClient.invalidateQueries(['memberList']); // invalidate the memberList

        toast.success({
          title: 'Member Info Updated',
          iconName: 'crown',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
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
