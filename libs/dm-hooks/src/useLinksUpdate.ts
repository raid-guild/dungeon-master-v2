/* eslint-disable import/prefer-default-export */
import { client, DELETE_AND_UPDATE_LINKS_BY_CONSULTATION } from '@raidguild/dm-graphql';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ILink } from 'libs/dm-types/src/misc';

const onSuccess = (queryClient) => {
    queryClient.invalidateQueries(['consultationList']);
    queryClient.invalidateQueries(['raidList']);
    queryClient.invalidateQueries(['memberList']);
    queryClient.invalidateQueries(['consultationDetail']);
    queryClient.invalidateQueries(['raidDetail']);
    queryClient.invalidateQueries(['memberDetail']);
};

const useLinksUpdate = ({ token, consultationId }: { token: string, consultationId: string }) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async (args: Partial<ILink>[]) => {
            const result = await client({ token }).request(DELETE_AND_UPDATE_LINKS_BY_CONSULTATION, {
                consultationId,
                insertLinks: args
            });

            return result;
        },
        { onSuccess: () => onSuccess(queryClient) }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export default useLinksUpdate;