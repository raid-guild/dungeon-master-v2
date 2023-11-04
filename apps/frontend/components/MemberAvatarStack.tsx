import _ from 'lodash';
import { Box } from '@raidguild/design-system';
import { IMember } from '@raidguild/dm-utils';
import MemberAvatar from './MemberAvatar';

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
  return (
    <Box
      display={horizontal ? 'flex' : 'flex'}
      flexDirection={horizontal ? 'row' : 'column'}
    >
      {_.map(members, (member: IMember, index: number) => (
        <Box
          key={_.get(member, 'id')}
          mt={!horizontal && index !== 0 ? '-12px' : '0'}
          ml={horizontal && index !== 0 ? '-12px' : '0'}
          zIndex={members.length - index}
        >
          <MemberAvatar member={member} />
        </Box>
      ))}
    </Box>
  );
};

export default MemberAvatarStack;
