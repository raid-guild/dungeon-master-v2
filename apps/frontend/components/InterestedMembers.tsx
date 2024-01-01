import {
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Tooltip,
} from '@raidguild/design-system';
import { useToggleInterest } from '@raidguild/dm-hooks';
import { IMember, IRaid } from '@raidguild/dm-types';
import { GUILD_CLASS_DISPLAY } from '@raidguild/dm-utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaCheck } from 'react-icons/fa';

import MemberAvatar from './MemberAvatar';
import MemberRoleStack from './MemberRoleStack';

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
        <Stack w='full'>
          {members.length &&
            members.map((member) => (
              <React.Fragment key={member?.id}>
                <MemberRoleStack member={member} withLink>
                  <HStack
                    spacing={4}
                    _hover={{ cursor: 'pointer', color: 'red.100' }}
                    transition='all ease-in-out 0.25'
                  >
                    {member && <MemberAvatar member={member} />}

                    <Flex direction='column'>
                      <Text as='span' color='white' fontSize='md'>
                        {_.get(member, 'name')}
                      </Text>
                      <Text
                        color='whiteAlpha.600'
                        fontSize='xs'
                        textTransform='uppercase'
                      >
                        {
                          GUILD_CLASS_DISPLAY[
                            _.get(member, 'guildClass.guildClass')
                          ]
                        }
                      </Text>
                    </Flex>
                  </HStack>
                </MemberRoleStack>
                <Divider opacity={0.1} />
              </React.Fragment>
            ))}
          {_.isEmpty(members) && (
            <Text size='md' fontFamily='spaceMono'>
              No interest shown yet
            </Text>
          )}
        </Stack>
      </Card>
      <Tooltip
        label={interestExists ? 'Remove Interest' : 'Add Interest'}
        aria-label='Interest Button'
      >
        <Button
          onClick={() => toggleSignal({ action, id: interestExists?.id })}
          variant='outline'
          gap={2}
        >
          {interestExists && <FaCheck />}
          {interestExists ? 'Interested' : 'Signal Interest'}
        </Button>
      </Tooltip>
    </>
  );
};

export default InterestedMembers;
