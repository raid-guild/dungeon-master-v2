import { client, CREATE_CONTACT_MUTATION } from '@raidguild/dm-graphql';
import { IContact } from "@raidguild/dm-types";
import { camelize } from '@raidguild/dm-utils';
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useContactCreate = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const createContact = async (contact: IContact) => {
        const result = await client({ token }).request(CREATE_CONTACT_MUTATION, {
            ...contact,
        });
        return camelize(result);
    };

    const { mutate, status, isLoading, isError, error } = useMutation(createContact, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['contacts']);
        },
    });

    return {
        mutate,
        status,
        isLoading,
        isError,
        error,
    };
}