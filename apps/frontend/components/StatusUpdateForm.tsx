import React from 'react';
import _ from 'lodash';
import { Stack, Button } from '@raidguild/design-system';
import useRaidUpdate from '../hooks/useRaidUpdate';
import { useSession } from 'next-auth/react';
// import { updateRecord } from '../utils';

const statusOptions = ['AWAITING', 'PREPARING', 'RAIDING', 'LOST', 'SHIPPED'];

interface StatusUpdateProps {
  raidId: string;
  currentStatus: string;
  closeModal?: () => void;
  // updateRaid: (key, value) => void;
}

const StatusUpdateForm: React.FC<StatusUpdateProps> = ({
  raidId,
  currentStatus = 'SHIPPED',
  closeModal,
}: // updateRaid,
StatusUpdateProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { mutate: updateRaidStatus, isLoading: updateRaidStatusIsLoading } =
    useRaidUpdate({ token });
  const handleSetStatus = async (e: any) => {
    const result = await updateRaidStatus();
    console.log('result', result);
    closeModal();
  };

  // better way to display current selected status?
  return (
    <Stack>
      {statusOptions.map((o) => {
        const selectedStatus = currentStatus === o;
        return (
          <Button
            variant={selectedStatus ? 'solid' : 'outline'}
            isDisabled={selectedStatus}
            onClick={handleSetStatus}
            key={o}
          >
            {o}
          </Button>
        );
      })}
    </Stack>
  );
};

export default StatusUpdateForm;
