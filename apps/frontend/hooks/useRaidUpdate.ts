import _ from 'lodash';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, RAID_UPDATE_MUTATION } from '../gql';
import { useRouter } from 'next/router';

const useRaidUpdate = ({ token }) => {
  const router = useRouter();
  const raidId = _.get(router, 'query.raid');
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess } = useMutation(
    async () => {
      console.log('firing update', raidId);
      console.log('token', token);
      if (!raidId || !token) return;
      const { data } = await client(token).mutate({
        mutation: RAID_UPDATE_MUTATION,
        variables: {
          id: raidId,
          status: 'PREPARING',
        },
      });
      console.log('data', data);
      return { data };
    },
    {
      onSuccess: (data) => {
        console.log('update success', data);
      },
    }
  );
  return { mutate, isLoading, isError, isSuccess };
};

export default useRaidUpdate;
