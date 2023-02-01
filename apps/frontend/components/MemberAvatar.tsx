import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Avatar, Tooltip } from '@raidguild/design-system';
import { useEnsAvatar, useEnsName, mainnet } from 'wagmi';
import * as blockies from 'blockies-ts';
import { IMember, memberDisplayName } from '../utils';

type MemberAvatarProps = {
  member: Partial<IMember>;
};

const MemberAvatar = ({ member }: MemberAvatarProps) => {
  const address = _.get(member, 'ethAddress');
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    enabled: !!address,
  });
  const { data: ensAvatar, isFetched } = useEnsAvatar({
    address,
    chainId: mainnet.id,
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
      <Avatar src={ensAvatar || avatarSrc} />
    </Tooltip>
  );
};

export default MemberAvatar;
