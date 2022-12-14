import _ from 'lodash';
import { Avatar, Tooltip } from '@raidguild/design-system';
import { useEnsAvatar, useEnsName, chain } from 'wagmi';
import { IMember, memberDisplayName } from '../utils';

type MemberAvatarProps = {
  member: IMember;
};

const MemberAvatar = ({ member }: MemberAvatarProps) => {
  const address = _.get(member, 'eth_address');
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({
    address,
    chainId: chain.mainnet.id,
  });

  return (
    <Tooltip
      label={memberDisplayName(member, ensName)}
      placement="left"
      hasArrow
    >
      <Avatar src={ensAvatar} />
    </Tooltip>
  );
};

export default MemberAvatar;
