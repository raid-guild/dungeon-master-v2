import { useToast } from '@raidguild/design-system';
import { client, DELETE_INTEREST_SIGNAL,INSERT_INTEREST_SIGNAL } from '@raidguild/dm-graphql';
import { ISignalInterest } from '@raidguild/dm-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _, {  } from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type UseToggleInterestProps = {
  token: string;
  memberId: string;
  consultationId?: string;
  raidId?: string;
};

const useToggleInterest = (props: UseToggleInterestProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const address = (session?.user as unknown as any)?.address;

  const {token, memberId, consultationId, raidId} = props
  const [action, setAction] = useState< string | null> (null)

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    async (args: Partial<ISignalInterest> & {action: string}) => {
      if (!memberId || !token) return null;
      
      setAction(args.action)

      if (args.action === 'insert') {
        const interestData = {
          // Construct the interest_data object based on args
          raid_id: raidId,
          consultation_id: consultationId,
          member_id: memberId,
        };

        

        return client({ token }).request(INSERT_INTEREST_SIGNAL, {
          interest_data: {...interestData},
        });
      } 


        return client({ token }).request(DELETE_INTEREST_SIGNAL, {
          id: args?.id
        });
      
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(['raidDetail', raidId]);
        queryClient.refetchQueries(['consultationDetail', consultationId]);
        queryClient.invalidateQueries(['consultationList']);
        queryClient.invalidateQueries(['raidList']); 
        queryClient.invalidateQueries(['dashboard', address]);
  
        
        toast.success({
          title: action === 'insert' ? 'Interest Added' : 'Interest Removed',
          description: `Your interest has been ${action === 'insert' ? 'added' : 'removed'}.`,
        });
      },
    }
  );

  return { mutateAsync, isLoading, isError, isSuccess };
};

export default useToggleInterest;
