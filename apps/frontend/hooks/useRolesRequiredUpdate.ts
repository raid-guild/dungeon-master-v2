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
      if (!raidId || !token) return;
      const { data } = await client(token).mutate({
        mutation: ROLES_REQUIRED_INSERT_MUTATION,
        variables: {
          raidParty: {
            raid_id: raidId,
            role,
          },
        },
      });

      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries([
          'raidDetail',
          _.get(data, 'insert_raids_roles_required.returning.0.raid_id'),
        ]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList
        console.log(
          _.get(data, 'insert_raids_roles_required.returning.0.raid')
        );
        queryClient.setQueryData(
          [
            'raidDetail',
            _.get(data, 'insert_raids_roles_required.returning.0.raid_id'),
          ],
          camelize(_.get(data, 'insert_raids_roles_required.returning.0.raid'))
        );
        // setButton
        // clear roleToAdd

        toast.success({
          title: 'Role Added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Raid',
          status: 'error',
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
      if (!where) return;
      const { data } = await client(token).mutate({
        mutation: ROLES_REQUIRED_DELETE_MUTATION,
        variables: {
          where,
        },
      });

      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries([
          'raidDetail',
          _.get(data, 'insert_raids_roles_required.returning.0.raid_id'),
        ]); // invalidate raidDetail with id from the successful mutation response
        queryClient.invalidateQueries(['raidList']); // invalidate the raidList
        console.log(
          _.get(data, 'insert_raids_roles_required.returning.0.raid')
        );
        queryClient.setQueryData(
          [
            'raidDetail',
            _.get(data, 'insert_raids_roles_required.returning.0.raid_id'),
          ],
          camelize(_.get(data, 'insert_raids_roles_required.returning.0.raid'))
        );
        // setButton
        // clear roleToAdd

        toast.success({
          title: 'Role Added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast.error({
          title: 'Unable to Update Raid',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  return { mutateAsync, isLoading, isError, isSuccess };
};
