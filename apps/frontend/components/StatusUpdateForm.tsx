import React from 'react';
import { Stack, Button } from '@raidguild/design-system';
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
  const handleSetStatus = async (e: any) => {
    // const result = await updateRecord('raid', raidId, {
    //   status: e.target.textContent,
    // });
    // if (result?.status) {
    //   closeModal();
    //   toast({
    //     title: 'Status Updated',
    //     status: 'success',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   updateRaid('status', e.target.textContent);
    // }
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
