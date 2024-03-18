import { Button, Stack } from '@raidguild/design-system';
import { useRaidUpdate } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React from 'react';

import { useOverlay } from '../contexts/OverlayContext';
import ModalWrapper from './ModalWrapper';
import RaidRetroModal from './RaidRetroModal';

const statusOptions = ['AWAITING', 'PREPARING', 'RAIDING', 'LOST', 'SHIPPED'];

interface StatusUpdateProps {
  raidId: string;
  currentStatus: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
}

const StatusUpdateForm = ({
  raidId,
  currentStatus = 'SHIPPED',
  closeModal,
  raid,
}: // updateRaid,
StatusUpdateProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { mutateAsync: updateRaidStatus } = useRaidUpdate({ token, raidId });

  const retroLinkUpdateOverlay = useOverlay();

  const { setModals, closeModals } = retroLinkUpdateOverlay;

  const handleRetroLinkUpdateModal = () => {
    setModals({ retroLinkUpdate: true, raidStatus: true });
  };

  const handleSetStatus = async (selectedStatus) => {
    if (selectedStatus === 'SHIPPED') {
      handleRetroLinkUpdateModal();
    } else {
      await updateRaidStatus({
        raid_updates: {
          status_key: selectedStatus,
        },
      });
      closeModal();
    }
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

      <ModalWrapper
        name='retroLinkUpdate'
        size='md'
        title='Update Retro Link'
        localOverlay={retroLinkUpdateOverlay}
        zIndex={200}
      >
        <RaidRetroModal
          raid={raid}
          closeModal={closeModals}
          updateStatus={updateRaidStatus}
        />
      </ModalWrapper>
    </Stack>
  );
};

export default StatusUpdateForm;
