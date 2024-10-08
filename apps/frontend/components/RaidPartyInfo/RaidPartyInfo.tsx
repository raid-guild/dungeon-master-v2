import { Card, Divider, Flex, Heading, Stack } from '@raidguild/design-system';
import { useSlimMemberList } from '@raidguild/dm-hooks';
import { IMember, IRaid } from '@raidguild/dm-types';
import { SIDEBAR_ACTION_STATES } from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import RaidPartyButtons from './RaidPartyButtons';
import RaidPartyCard from './RaidPartyCard';

interface RaidInfoProps {
  raid?: Partial<IRaid>;
  // consultation?: IConsultation;
}

const RaidPartyInfo = ({ raid }: RaidInfoProps) => {
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
  const hunter = _.get(raid, 'hunter');
  const raidParty = _.get(raid, 'raidParties');

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
            <Flex direction='column' py={2}>
              <Stack>
                <Heading color='white' size='sm'>
                  Hunter
                </Heading>

                <RaidPartyCard
                  raid={raid}
                  member={hunter}
                  members={members}
                  isHunter
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
                {_.map(
                  raidParty,
                  (raider: {
                    member: Partial<IMember>;
                    raiderClassKey: string;
                  }) => (
                    <RaidPartyCard
                      raid={raid}
                      member={raider.member}
                      raiderClassKey={raider.raiderClassKey}
                      key={_.get(raider.member, 'id')}
                    />
                  )
                )}
              </Stack>
            )}
            {!_.isEmpty(localRoles) && (
              <Stack spacing={2}>
                <Divider />
                <Heading color='white' size='sm'>
                  Recruiting
                </Heading>
                <RaidPartyCard roles={localRoles} />
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
