import { useToast } from '@raidguild/design-system';
import {
  client,
  RAID_PARTY_DELETE_MUTATION,
  RAID_PARTY_INSERT_MUTATION,
} from '@raidguild/dm-graphql';
import { IRaidPartyInsert } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';

export const useRaidPartyAdd = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ raidId, memberId }: IRaidPartyInsert) => {
      if (!raidId || !token) return null;
      return client({ token }).request(RAID_PARTY_INSERT_MUTATION, {
        raid_parties: {
          raid_id: raidId,
          member_id: memberId,
        },
      });
    },
    {
      onSuccess: (data) => {
        const raid = camelize(
          _.get(
            data,
            'insert_raid_parties.returning.0.raid',
            _.get(data, 'update_raids_by_pk.returning.0.raid')
          )
        );
        queryClient.invalidateQueries(['raidDetail', _.get(raid, 'id')]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']);
        queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);

        toast.success({
          title: 'Raid Party Updated',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Raid',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  return { mutateAsync, isLoading, isError, isSuccess };
};

export const useRaidPartyRemove = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ raidId, memberId }: IRaidPartyInsert) => {
      if (!raidId || !token) return null;

      return client({ token }).request(RAID_PARTY_DELETE_MUTATION, {
        where: {
          _and: {
            member_id: { _eq: memberId },
            raid_id: { _eq: raidId },
          },
        },
      });
    },

    {
      onSuccess: (data) => {
        const raid = camelize(
          _.get(data, 'delete_raid_parties.returning.0.raid')
        );
        queryClient.invalidateQueries(['raidDetail', _.get(raid, 'id')]); // invalidate raidDetail with id from the successful mutation response
        queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);
        toast.success({
          title: 'Raid Party Updated',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Raid',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useRaidPartyAdd;
