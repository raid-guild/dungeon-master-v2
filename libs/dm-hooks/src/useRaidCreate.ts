import { useToast } from '@raidguild/design-system';
import { client, RAID_CREATE_MUTATION } from '@raidguild/dm-graphql';
import { IRaidCreate } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useRouter } from 'next/router';

const useRaidCreate = ({ token }: { token: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IRaidCreate) => {
      if (!token) return null;
      const result = await client({ token }).request(RAID_CREATE_MUTATION, {
        raid: {
          ...args,
        },
      });

      return result;
    },
    {
      onSuccess: (data) => {
        const raid = camelize(_.get(data, 'insert_raids_one'));

        queryClient.invalidateQueries(['raidDetail', _.get(raid, 'id')]);
        queryClient.invalidateQueries(['raidList']);
        queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);

        router.push(`/raids/${_.get(raid, 'id')}`);

        setTimeout(() => {
          toast.success({
            title: 'Raid Created',
            iconName: 'crown',
            duration: 3000,
            isClosable: true,
          });
        }, 1000);
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to create Raid',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useRaidCreate;
