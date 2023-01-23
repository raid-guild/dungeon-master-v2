import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useToast } from '@raidguild/design-system';
import { useRouter } from 'next/router';

import { client, MEMBER_CREATE_MUTATION } from '../gql';
import { IMemberCreate, camelize } from '../utils';

const useMemberCreate = ({ token }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IMemberCreate) => {
      if (!token) return null;
      const result = await client({ token }).request(MEMBER_CREATE_MUTATION, {
        member: { ...args },
      });

      return result;
    },
    {
      onSuccess: (data) => {
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
