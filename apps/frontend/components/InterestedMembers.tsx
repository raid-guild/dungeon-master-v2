import {
  Button,
  Card,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@raidguild/design-system';
import { useToggleInterest } from '@raidguild/dm-hooks';
import { IMember, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React from 'react';

import MemberAvatar from './MemberAvatar';

const InterestedMembers = ({
  members,
  raid,
}: {
  members: IMember[];
  raid: Partial<IRaid>;
}) => {
  const { data: session } = useSession();

  const token = session?.token;
  const memberId = session?.user?.id;

  const interestExists = _.find(raid?.consultation?.signalledInterests, {
    memberId,
  });

  const { mutateAsync: toggleSignal } = useToggleInterest({
    token,
    memberId,
    raidId: raid?.id,
    consultationId: raid?.consultation?.id,
  });

  const action = interestExists ? 'delete' : 'insert';

  return (
    <>
      <Heading mt={10} size='md'>
        Interested Members
      </Heading>
      <Card variant='filled'>
        <VStack w='full'>
          {members.length &&
            members.map((member) => (
              <React.Fragment key={member.id}>
                <HStack w='full' gap={2}>
                  <MemberAvatar member={member} />
                  <Stack
                    justifyContent='flex-start'
                    alignItems='flex-start'
                    gap={0.5}
                  >
                    <Text>{member.name}</Text>
                    <Text color='primary.500'>
                      {_.startCase(_.toLower(member?.guildClass?.guildClass))}
                    </Text>
                  </Stack>
                </HStack>
                <Divider opacity={0.1} />
              </React.Fragment>
            ))}
          {_.isEmpty(members) && (
            <Heading size='sm'>No Interest Shown yet</Heading>
          )}
        </VStack>
      </Card>
      <Tooltip
        label={interestExists ? 'Remove Interest' : 'Add Interest'}
        aria-label='Interest Button'
      >
        <Button
          onClick={() => toggleSignal({ action, id: interestExists?.id })}
          fontFamily='spaceMono'
          variant='outline'
        >
          {interestExists ? 'Interested' : 'Signal Interest'}
        </Button>
      </Tooltip>
    </>
  );
};

export default InterestedMembers;
