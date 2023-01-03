import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { camelize } from '../utils';
import { useToast } from '@raidguild/design-system';
import {
  client,
  RAID_PARTY_DELETE_MUTATION,
  RAID_PARTY_INSERT_MUTATION,
} from '../gql';
import { IRaidPartyInsert } from '../utils';

export const useRaidPartyAdd = ({ token }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ raidId, memberId }: IRaidPartyInsert) => {
      if (!raidId || !token) return;
      const result = await client({ token }).request(
        RAID_PARTY_INSERT_MUTATION,
        {
          raid_parties: {
            raid_id: raidId,
            member_id: memberId,
          },
        }
      );

      return result;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries([
          'raidDetail',
          _.get(data, 'insert_raid_parties.returning.0.raid_id'),
        ]); // invalidate raidDetail with id from the successful mutation response
        queryClient.setQueryData(
          [
            'raidDetail',
            _.get(data, 'insert_raid_parties.returning.0.raid_id'),
          ],
          camelize(_.get(data, 'insert_raid_parties.returning.0.raid'))
        );

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

export const useRaidPartyRemove = ({ token }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ raidId, memberId }: IRaidPartyInsert) => {
      console.log(raidId, memberId);
      if (!raidId || !token) return;
      const { data } = await client({ token }).request(
        RAID_PARTY_DELETE_MUTATION,
        {
          where: {
            _and: {
              member_id: { _eq: memberId },
              raid_id: { _eq: raidId },
            },
          },
        }
      );

      return data;
    },

    {
      onSuccess: (data) => {
        console.log('here?', data);
        queryClient.invalidateQueries([
          'raidDetail',
          _.get(data, 'delete_raid_parties.returning.0.raid_id'),
        ]); // invalidate raidDetail with id from the successful mutation response
        queryClient.setQueryData(
          [
            'raidDetail',
            _.get(data, 'delete_raid_parties.returning.0.raid_id'),
          ],
          camelize(_.get(data, 'delete_raid_parties.returning.0.raid'))
        );
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
