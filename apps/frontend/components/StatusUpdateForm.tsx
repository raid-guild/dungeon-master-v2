import React from 'react';
import _ from 'lodash';
import { Stack, Button } from '@raidguild/design-system';
import useRaidUpdate from '../hooks/useRaidUpdate';
import { useSession } from 'next-auth/react';

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
  const { mutateAsync: updateRaidStatus } = useRaidUpdate({ token, raidId });

  const handleSetStatus = async (selectedStatus) => {
    console.log('selectedStatus', selectedStatus);
    const result = await updateRaidStatus({ status: selectedStatus });
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
            onClick={() => handleSetStatus(o)}
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
