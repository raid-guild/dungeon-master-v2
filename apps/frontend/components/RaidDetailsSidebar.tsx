import React from 'react';
import _ from 'lodash';
import { HStack, Button, Heading, Text, Stack } from '@chakra-ui/react';

import { IRaid } from '../utils';
import StatusUpdateForm from './StatusUpdateForm';
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

  const handleShowStatusModal = () => {
    setModals({ raidStatus: true });
  };

  return (
    <Stack spacing={5}>
      <HStack>
        <Button onClick={handleShowStatusModal} w="75%">
          {_.get(raid, 'raidStatus.raidStatus')}
        </Button>
        <Button variant="outline">Edit</Button>
      </HStack>

      <ModalWrapper
        name="raidStatus"
        size="sm"
        title="Update Raid Status"
        localOverlay={localOverlay}
        content={
          <StatusUpdateForm
            raidId={_.get(raid, 'id')}
            currentStatus={_.get(raid, 'raidStatus.raidStatus')}
            closeModal={closeModals}
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
