import { client, CREATE_CONTACT_MUTATION } from '@raidguild/dm-graphql';
import { IContact, IContactInfo } from "@raidguild/dm-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useContactCreate = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async (args: { contactData: Partial<IContact>, contactInfoData: Partial<IContactInfo> }) => {
            const { contactData, contactInfoData } = args;
            const result = await client({ token }).request(CREATE_CONTACT_MUTATION, {
                contact: {
                    ...contactData,
                    contact_info: {
                        data: contactInfoData,
                        on_conflict: { constraint: 'contact_infos_pkey', update_columns: ['discord', 'email', 'github', 'telegram', 'twitter'] }
                    }
                }
            });

            return result;
        },
        { 
            onSuccess: () => {
                queryClient.invalidateQueries(['contacts']);
            }
        }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export default useContactCreate;
