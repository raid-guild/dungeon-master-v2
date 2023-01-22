import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useToast } from '@raidguild/design-system';
import {
  client,
  ROLES_REQUIRED_INSERT_MUTATION,
  ROLES_REQUIRED_DELETE_MUTATION,
} from '../gql';
import { IRoleRequiredInsert, IRoleRemoveMany, camelize } from '../utils';

export const useAddRolesRequired = ({ token }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ raidId, role }: IRoleRequiredInsert) => {
      if (!raidId || !token) return null;

      return client({ token }).request(ROLES_REQUIRED_INSERT_MUTATION, {
        raidParty: {
          raid_id: raidId,
          role,
        },
      });
    },
    {
      onSuccess: (data) => {
        const raid = camelize(
          _.get(data, 'insert_raids_roles_required.returning.0.raid')
        );
        queryClient.invalidateQueries(['raidDetail', _.get(raid, 'id')]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList
        queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);
        // TODO setButton
        // TODO clear roleToAdd

        toast.success({
          title: 'Role Added',
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

export const useRemoveRolesRequired = ({ token }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ where }: IRoleRemoveMany) => {
      if (!where) return null;

      return client({ token }).request(ROLES_REQUIRED_DELETE_MUTATION, {
        where,
      });
    },
    {
      onSuccess: (data) => {
        const raid = camelize(
          _.get(data, 'delete_raids_roles_required.returning.0.raid')
        );
        queryClient.invalidateQueries(['raidDetail', _.get(raid, 'id')]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList

        queryClient.setQueryData(['raidDetail', _.get(raid, 'id')], raid);
        // TODO setButton
        // TODO clear roleToAdd

        toast.success({
          title: 'Role Added',
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
