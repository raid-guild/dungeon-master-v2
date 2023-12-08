import { client, CREATE_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION } from '@raidguild/dm-graphql';
import { IContact } from "@raidguild/dm-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useContactUpdate = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    async function handleContactOperation(contact: IContact) {
        if (!contact) return null;

        const operation = contact.id ? UPDATE_CONTACT_MUTATION : CREATE_CONTACT_MUTATION;
        let variables: { id?: string, contact: IContact };

        if (contact.id) {
            const { id, ...contactData } = contact;
            variables = { id, contact: contactData };
        } else {
            variables = { contact };
        }

        try {
            const result = await client({ token }).request(operation, variables);
            return result;
        } catch (error) {
            console.error("Error in handleContactOperation:", error);
            throw error;
        }
    }

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(handleContactOperation, {
        onSuccess: () => {
            queryClient.invalidateQueries(['contacts']);
        },
    });

    return { mutateAsync, isLoading, isError, isSuccess };
}

export default useContactUpdate;
