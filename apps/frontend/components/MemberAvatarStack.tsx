import { Box, Flex } from '@raidguild/design-system';
import { IMember } from '@raidguild/dm-types';
import _ from 'lodash';

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
  if (horizontal) {
    return (
      <Flex>
        {_.map(_.slice(members, 0, max), (member: IMember, i: number) => (
          <Box
            as='span'
            display='inline-block'
            overflow='hidden'
            zIndex={max - i}
            _notFirst={{ ml: '-10px' }}
          >
            <MemberAvatar member={member} key={_.get(member, 'id')} />
          </Box>
        ))}
      </Flex>
    );
  }

  return (
    <Flex direction='column' align='center'>
      {_.map(_.slice(members, 0, max), (member: IMember, i: number) => (
        <Box
          as='span'
          display='inline-block'
          overflow='hidden'
          zIndex={max - i}
          _notFirst={{ mt: '-10px' }}
        >
          <MemberAvatar member={member} key={_.get(member, 'id')} size={10} />
        </Box>
      ))}
    </Flex>
  );
};

export default MemberAvatarStack;
