import { useToast } from '@raidguild/design-system';
import { client, CREATE_CONTACT_MUTATION } from '@raidguild/dm-graphql';
import { IContact, IContactInfo } from "@raidguild/dm-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useContactCreate = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    const toast = useToast();
    
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
                toast.success({
                    title: 'Contact Updated',
                    iconName: 'crown',
                    duration: 3000,
                    isClosable: true,
                  });
            }
            ,
            onError: (error) => {
                // eslint-disable-next-line no-console
                console.log(error);
                toast.error({
                    title: 'Unable to update contact',
                    iconName: 'alert',
                    duration: 3000,
                    isClosable: true,
                  });
            }
        }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export default useContactCreate;
