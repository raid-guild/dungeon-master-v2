import { Avatar, Tooltip } from '@raidguild/design-system';
import { IMember } from '@raidguild/dm-types';
import { memberDisplayName } from '@raidguild/dm-utils';
import * as blockies from 'blockies-ts';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useEnsAvatar, useEnsName } from 'wagmi';

type MemberAvatarProps = {
  member: Partial<IMember>;
};

const MemberAvatar = ({ member }: MemberAvatarProps) => {
  const address = _.get(member, 'ethAddress');
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
    enabled: !!address,
  });
  const { data: ensAvatar, isFetched } = useEnsAvatar({
    name: ensName,
    chainId: 1,
    enabled: !!address,
    cacheTime: 6_000,
  });

  useEffect(() => {
    if (avatarSrc === '' && !ensAvatar && isFetched) {
      setAvatarSrc(blockies.create({ seed: address }).toDataURL());
    }
  }, [avatarSrc, ensAvatar, isFetched, address]);

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
      <Avatar src={ensAvatar || avatarSrc} boxSize={8} />
    </Tooltip>
  );
};

export default MemberAvatar;
