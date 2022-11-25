import _ from 'lodash';
import { Flex } from '@raidguild/design-system';
import MemberAvatar from './MemberAvatar';
import { IMember } from '../utils';

const MemberAvatarStack = ({ members }) => (
  <Flex>
    {_.map(members, (member: IMember) => (
      <MemberAvatar member={member} />
    ))}
  </Flex>
);

export default MemberAvatarStack;
