/* eslint-disable import/prefer-default-export */
import { client, DELETE_LINKS_MUTATION, INSERT_LINKS_MUTATION, UPDATE_LINKS_MUTATION } from '@raidguild/dm-graphql';
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

export const useAddLinks = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async (args: ILink[]) => {
            const result = await client({ token }).request(INSERT_LINKS_MUTATION, {
                insertLinks: args.map(link => ({
                    link: link.link,
                    type: link.type
                }))
            });

            return result;
        },
        { onSuccess: () => onSuccess(queryClient) }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export const useUpdateLinks = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async (args: ILink[]) => {
            const result = await client({ token }).request(UPDATE_LINKS_MUTATION, {
                updates: args
            });

            return result;
        },
        { onSuccess: () => onSuccess(queryClient) }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export const useDeleteLinks = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async ({ id }: { id: string }) => {
            const result = await client({ token }).request(DELETE_LINKS_MUTATION, {
                id,
            });

            return result;
        },
        { onSuccess: () => onSuccess(queryClient) }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};
