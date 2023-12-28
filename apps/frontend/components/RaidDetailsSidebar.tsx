import { Button, HStack, Stack } from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import React from 'react';

import { useOverlay } from '../contexts/OverlayContext';
import InterestedMembers from './InterestedMembers';
import ModalWrapper from './ModalWrapper';
import RaidPartyInfo from './RaidPartyInfo';
import RaidUpdateForm from './RaidUpdateForm';
import StatusUpdateForm from './StatusUpdateForm';

interface RaidDetailsSidebarProps {
  raid: Partial<IRaid>;
}

const RaidDetailsSidebar = ({ raid }: RaidDetailsSidebarProps) => {
  const localOverlay = useOverlay();
  const { setModals, closeModals } = localOverlay;
  // const relatedRaids = _.get(raid, 'raidByRelatedRaids');

  const handleShowStatusModal = () => {
    setModals({ raidStatus: true });
  };

  const handleShowRaidUpdateFormModal = () => {
    setModals({ raidForm: true });
  };

  const interestedMembers = _.map(
    raid.consultation.signalledInterests,
    'member'
  );

  return (
    <Stack spacing={5}>
      <HStack w='100%'>
        <Button onClick={handleShowStatusModal} flexGrow={1}>
          {_.get(raid, 'raidStatus.raidStatus')}
        </Button>
        <Button variant='outline' onClick={handleShowRaidUpdateFormModal}>
          Edit
        </Button>
      </HStack>

      <ModalWrapper
        name='raidStatus'
        size='sm'
        title='Update Raid Status'
        localOverlay={localOverlay}
      >
        <StatusUpdateForm
          raidId={_.get(raid, 'id')}
          raid={raid}
          currentStatus={_.get(raid, 'raidStatus.raidStatus')}
          closeModal={closeModals}
        />
      </ModalWrapper>
      <ModalWrapper
        name='raidForm'
        size='xl'
        title='Update Raid'
        localOverlay={localOverlay}
      >
        <RaidUpdateForm raid={raid} closeModal={closeModals} />
      </ModalWrapper>

      <RaidPartyInfo raid={raid} />
      <InterestedMembers members={interestedMembers} raid={raid} />
      {/* RAID TAGS */}
      {/* <RaidTags raid={raid} /> */}
      {/* RELATED RAIDS */}
      {/* {_.map(relatedRaids, (raid: IRaid) => (
        <Text key={1}>Related Raid 1</Text>
      ))} */}
    </Stack>
  );
};

export default RaidDetailsSidebar;
