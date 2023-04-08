import React, { useState } from 'react';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { Flex, Stack, Divider, Card, Heading } from '@raidguild/design-system';
import {
  IMember,
  IRaid,
  // IConsultation,
  SIDEBAR_ACTION_STATES,
} from '@raidguild/dm-utils';
import { useSlimMemberList } from '@raidguild/dm-hooks';

import RaidPartyButtons from './RaidPartyButtons';
// import MemberAvatar from '../MemberAvatar';
import RaidPartyCard from './RaidPartyCard';

interface RaidInfoProps {
  raid?: Partial<IRaid>;
  // consultation?: IConsultation;
}

const RaidPartyInfo: React.FC<RaidInfoProps> = ({ raid }: RaidInfoProps) => {
  const [buttonSelection, setButtonSelection] = useState<string>(
    SIDEBAR_ACTION_STATES.none
  );
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: members } = useSlimMemberList({
    token,
    button: buttonSelection,
  });

  const localRoles = _.map(_.get(raid, 'raidsRolesRequired'), 'role');
  const cleric = _.get(raid, 'cleric');
  const raidParty = _.map(_.get(raid, 'raidParties'), 'member');

  return (
    <Stack spacing={3}>
      <Heading size='md'>Raid Party</Heading>
      <Stack spacing={5}>
        <Card variant='filled'>
          <Stack width='100%'>
            <Flex direction='column' py={2}>
              <Stack>
                <Heading color='white' size='sm'>
                  Cleric
                </Heading>
                <RaidPartyCard
                  raid={raid}
                  member={cleric}
                  members={members}
                  isCleric
                  setButtonSelection={setButtonSelection}
                />
              </Stack>
            </Flex>
            {!_.isEmpty(raidParty) && (
              <Stack spacing={4}>
                <Divider />
                <Heading color='white' size='sm'>
                  Raiders
                </Heading>
                {_.map(raidParty, (member: Partial<IMember>) => (
                  <RaidPartyCard
                    raid={raid}
                    member={member}
                    key={_.get(member, 'id')}
                  />
                ))}
              </Stack>
            )}
            {!_.isEmpty(localRoles) && (
              <Stack spacing={2}>
                <Divider />
                <Heading color='white' size='sm'>
                  Recruiting
                </Heading>
                <RaidPartyCard roles={localRoles} isRole />
              </Stack>
            )}
          </Stack>
        </Card>
        <RaidPartyButtons
          raid={raid}
          cleric={cleric}
          raidParty={raidParty}
          members={members}
          button={buttonSelection}
          setButton={setButtonSelection}
        />
      </Stack>
    </Stack>
  );
};

export default RaidPartyInfo;
