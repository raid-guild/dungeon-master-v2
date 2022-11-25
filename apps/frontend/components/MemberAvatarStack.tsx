import _ from 'lodash';
import { AvatarGroup } from '@raidguild/design-system';
import MemberAvatar from './MemberAvatar';
import { IMember } from '../utils';

type MemberAvatarStackProps = {
  members: IMember[];
  size?: 'sm' | 'md' | 'lg';
  max?: number;
};

const MemberAvatarStack = ({
  members,
  size = 'md',
  max = 5,
}: MemberAvatarStackProps) => (
  <AvatarGroup size={size} max={max}>
    {_.map(members, (member: IMember) => (
      <MemberAvatar member={member} />
    ))}
  </AvatarGroup>
);

export default MemberAvatarStack;
