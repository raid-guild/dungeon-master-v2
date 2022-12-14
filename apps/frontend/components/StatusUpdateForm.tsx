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

  // airtable_id: String
  // category: raid_categories_enum
  // cleric: uuid
  // consultation: uuid
  // created_at: timestamptz
  // end_date: timestamptz
  // escrow_index: Int
  // id: uuid
  // invoice_address: String
  // locker_hash: String
  // name: String
  // portfolio: uuid
  // start_date: timestamptz
  // status: raid_statuses_enum
  // updated_at: timestamptz
  // v1_id: String

  // const raidWithoutUpdatedStatus = _.omit(
  //   raid,
  //   'status',
  //   'airtableId',
  //   'v1Id',
  //   'lockerHash',
  //   'invoiceAddress',
  //   'raidCategory',
  //   'raidParties',
  //   'consultation',
  //   'typename',
  //   'raidStatus',
  //   'cleric',
  //   'raidsRolesRequired',
  //   'createdAt',
  //   'updatedAt',
  //   'escrowIndex'
  // );

  const handleSetStatus = async (selectedStatus) => {
    await updateRaidStatus({
      raid_updates: {
        status_key: selectedStatus,
      },
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
