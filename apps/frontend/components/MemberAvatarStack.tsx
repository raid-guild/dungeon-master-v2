import _ from 'lodash';
import { Stack, HStack } from '@raidguild/design-system';
import MemberAvatar from './MemberAvatar';
import { IMember } from '../utils';

type MemberAvatarStackProps = {
  members: IMember[];
  size?: 'sm' | 'md' | 'lg';
  max?: number;
  horizontal?: boolean;
};

const MemberAvatarStack = ({
  members,
  size = 'md',
  max = 5,
  horizontal = false,
}: MemberAvatarStackProps) => {
  if (horizontal) {
    return (
      <HStack spacing={4}>
        {_.map(members, (member: IMember) => (
          <MemberAvatar member={member} />
        ))}
      </HStack>
    );
  }

  return (
    <Stack align="center" spacing={4}>
      {_.map(members, (member: IMember) => (
        <MemberAvatar member={member} />
      ))}
    </Stack>
  );
};

export default MemberAvatarStack;
