import { useToast } from '@raidguild/design-system';
import { client, UPSERT_CONSULTATION_CONTACTS_MUTATION } from '@raidguild/dm-graphql';
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpsertconsultationsContacts = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async (args: { updates: {consultation_id: string, contact_id: string}[] }) => {
            const { updates } = args;
            const result = await client({ token }).request(UPSERT_CONSULTATION_CONTACTS_MUTATION, {
                objects: updates,
                consultation_id: updates[0].consultation_id,
            });

            return result;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['raidDetail']);
                toast.success({
                    title: 'Consultation Contacts Updated',
                    iconName: 'crown',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                // eslint-disable-next-line no-console
                console.error(error);
                toast.error({
                    title: 'Unable to update consultation contacts',
                    iconName: 'alert',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export default useUpsertconsultationsContacts;
