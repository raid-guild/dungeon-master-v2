import { useToast } from '@raidguild/design-system';
import { client, CONSULTATION_UPDATE_MUTATION } from '@raidguild/dm-graphql';
import { IConsultationUpdate } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';

const useConsultationUpdate = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async ({ ...args }: IConsultationUpdate) => {
      if (!token) return null;
      const result = await client({ token }).request(
        CONSULTATION_UPDATE_MUTATION,
        {
          ...args,
        }
      );

      return result;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([
          'consultationDetail',
          _.get(data, 'id'),
        ]);
        queryClient.invalidateQueries(['consultationList']);
        queryClient.setQueryData(
          ['consultationDetail', _.get(data, 'id')],
          camelize(data)
        );

        toast.success({
          title: 'Consultation Cancelled',
          iconName: 'crown',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        toast.error({
          title: 'Unable to update Consultation',
          iconName: 'alert',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useConsultationUpdate;
