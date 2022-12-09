import React from 'react';
import _ from 'lodash';
import { HStack, Button, Text, Stack, Modal } from '@raidguild/design-system';
import { IRaid } from '../utils';
import StatusUpdateForm from './StatusUpdateForm';
import RaidUpdateForm from './RaidUpdateForm';
import ModalWrapper from './ModalWrapper';
import RaidPartyInfo from './RaidPartyInfo';
import RaidTags from './RaidTags';
import { useOverlay } from '../contexts/OverlayContext';

interface RaidDetailsSidebarProps {
  raid: Partial<IRaid>;
}

const RaidDetailsSidebar: React.FC<RaidDetailsSidebarProps> = ({
  raid,
}: RaidDetailsSidebarProps) => {
  const localOverlay = useOverlay();
  const { setModals, closeModals } = localOverlay;
  const relatedRaids = _.get(raid, 'raidByRelatedRaids');

  console.log('raid in sidebar', raid);
  const handleShowStatusModal = () => {
    setModals({ raidStatus: true });
  };

  const handleShowRaidUpdatFormModal = () => {
    setModals({ raidForm: true });
  };

  return (
    <Stack spacing={5}>
      <HStack>
        <Button onClick={handleShowStatusModal} w="75%">
          {_.get(raid, 'status')}
        </Button>
        <Button variant="outline" onClick={handleShowRaidUpdatFormModal}>
          Edit
        </Button>
      </HStack>

      <ModalWrapper
        name="raidStatus"
        size="sm"
        title="Update Raid Status"
        localOverlay={localOverlay}
        content={
          <StatusUpdateForm
            raidId={_.get(raid, 'id')}
            raid={raid}
            currentStatus={_.get(raid, 'status')}
            closeModal={closeModals}
          />
        }
      />
      <ModalWrapper
        name="raidForm"
        size="xl"
        title="Update Raid"
        localOverlay={localOverlay}
        content={
          <RaidUpdateForm
            raidId={_.get(raid, 'id')}
            raid={raid}
            // currentStatus={_.get(raid, 'status')}
            onClose={closeModals}
          />
        }
      />

      <RaidPartyInfo raid={raid} />
      <RaidTags raid={raid} />
      {_.map(relatedRaids, (raid: IRaid) => (
        <Text key={1}>Related Raid 1</Text>
      ))}
    </Stack>
  );
};

export default RaidDetailsSidebar;
