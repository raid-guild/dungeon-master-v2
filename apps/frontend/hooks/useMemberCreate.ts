import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { client, MEMBER_CREATE_MUTATION } from '../gql';
import { useToast } from '@raidguild/design-system';
import { IMemberCreate, camelize } from '../utils';
import { useRouter } from 'next/router';

const useMemberCreate = ({ token }) => {
  console.log('useMemberCreate');

  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IMemberCreate) => {
      if (!token) return;
      const result = await client(token).request(MEMBER_CREATE_MUTATION, {
        member: { ...args },
      });

      return result;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.setQueryData(
          ['memberDetail', _.get(data, 'insert_members_one.id')],
          camelize(_.get(data, 'insert_members_one'))
        );

        router.push(
          `/members/${_.get(data, 'insert_members_one.eth_address')}`
        );

        setTimeout(() => {
          toast.success({
            title: 'Member Created',
            iconName: 'crown',
            duration: 3000,
            isClosable: true,
          });
        }, 1000);
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to create Member',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useMemberCreate;
