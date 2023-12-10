import { client, UPDATE_CONTACT_MUTATION } from '@raidguild/dm-graphql';
import { IContact, IContactInfo } from "@raidguild/dm-types"; // Assuming IContactInfo is the type for contact info
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useContactUpdate = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
        async (args: { contactData: Partial<IContact>, contactInfoData: Partial<IContactInfo>, contactInfoId: string }) => {
            const { contactData, contactInfoData, contactInfoId } = args;
            const result = await client({ token }).request(UPDATE_CONTACT_MUTATION, {
                id: contactData.id, 
                contact: contactData,
                contact_info_id: contactInfoId,
                updates: contactInfoData
            });

            return result;
        },
        // { onSuccess: () => onSuccess(queryClient) }
    );

    return { mutateAsync, isLoading, isError, isSuccess };
};

export default useContactUpdate;
