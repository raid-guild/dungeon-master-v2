import { client } from '@raidguild/dm-graphql';
import { IContact } from "@raidguild/dm-types";
import { camelize } from '@raidguild/dm-utils';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CONTACT_INFOS_FRAGMENT } from 'libs/dm-graphql/src/fragments';

const useContactCreate = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const createContact = async (contact: IContact) => {
        const result = await client({ token }).request(CONTACT_INFOS_FRAGMENT, {
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