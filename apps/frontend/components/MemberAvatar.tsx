import _ from 'lodash';
import { Avatar, Tooltip } from '@raidguild/design-system';
import { useEnsAvatar, useEnsName, mainnet } from 'wagmi';
import { IMember, memberDisplayName } from '../utils';
import * as blockies from 'blockies-ts';

type MemberAvatarProps = {
  member: Partial<IMember>;
};

const MemberAvatar = ({ member }: MemberAvatarProps) => {
  const address = _.get(member, 'ethAddress');
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    enabled: !!address,
  });
  let { data: avatarSrc } = useEnsAvatar({
    address,
    chainId: mainnet.id,
    enabled: !!address,
    cacheTime: 360_000,
  });
  if (!avatarSrc) {
    avatarSrc = blockies.create({ seed: address }).toDataURL();
  }

  if (!address) {
    return (
      <Tooltip label={memberDisplayName(member)}>
        <Avatar />
      </Tooltip>
    );
  }

  return (
    <Tooltip
      label={memberDisplayName(member, ensName)}
      placement='left'
      hasArrow
    >
      <Avatar src={avatarSrc} />
    </Tooltip>
  );
};

export default MemberAvatar;
