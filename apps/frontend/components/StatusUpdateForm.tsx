import React from 'react';
import _ from 'lodash';
import { Stack, Button } from '@raidguild/design-system';
import useRaidUpdate from '../hooks/useRaidUpdate';
import { useSession } from 'next-auth/react';
import { IRaid } from '../utils';

const statusOptions = ['AWAITING', 'PREPARING', 'RAIDING', 'LOST', 'SHIPPED'];

interface StatusUpdateProps {
  raidId: string;
  currentStatus: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // updateRaid: (key, value) => void;
}

const StatusUpdateForm: React.FC<StatusUpdateProps> = ({
  raidId,
  currentStatus = 'SHIPPED',
  closeModal,
  raid,
}: // updateRaid,
StatusUpdateProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { mutateAsync: updateRaidStatus } = useRaidUpdate({ token, raidId });

  const raidWithoutUpdatedStatus = _.omit(raid, 'status');

  const handleSetStatus = async (selectedStatus) => {
    await updateRaidStatus({
      status: selectedStatus,
      ...raidWithoutUpdatedStatus,
    });
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
