import { Avatar, Tooltip } from '@raidguild/design-system';
import { IMember } from '@raidguild/dm-types';
import { memberDisplayName } from '@raidguild/dm-utils';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useEnsAvatar, useEnsName } from 'wagmi';

type MemberAvatarProps = {
  member: Partial<IMember>;
  size?: number;
  outlineColor?: string;
};

const MemberAvatar = ({ member, size=8, outlineColor }: MemberAvatarProps) => {
  const address = member?.ethAddress;
  const name = memberDisplayName(member);
  const github = member?.contactInfo?.github;

  // Fetch ENS Name and Avatar
  const { data: ensName } = useEnsName({ address, chainId: 1, enabled: !!address });
  const { data: ensAvatar, isFetched } = useEnsAvatar({
    name: ensName,
    chainId: 1,
    enabled: !!ensName,
    cacheTime: 60000, // Cache time in milliseconds
  });

  // State for Blockies Avatar
  const [blockiesAvatar, setBlockiesAvatar] = useState<string>('');

  // Generate Blockies Avatar as fallback
  useEffect(() => {
    if (!ensAvatar && isFetched && address) {
      setBlockiesAvatar(blockies.create({ seed: address }).toDataURL());
    }
  }, [ensAvatar, isFetched, address]);

  // Guess ENS and GitHub Avatars
  const guessAlias = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const { data: guessedEnsAvatar } = useEnsAvatar({ name: `${guessAlias}.eth` });
  const guessedGithubAvatar = `https://github.com/${guessAlias}.png`;
  
  // eslint-disable-next-line no-nested-ternary
  const githubAvatar = _.isString(github) ? 
    (github.startsWith('http') ? `${github}.png` : `https://github.com/${github}.png`) : 
    guessedGithubAvatar;

  // Determine Final Avatar
  const finalAvatar = ensAvatar || githubAvatar || guessedEnsAvatar || blockiesAvatar;

  return (
    <Tooltip label={name} placement={address ? 'left' : 'top'} hasArrow>
      <Avatar src={finalAvatar || blockiesAvatar} boxSize={size} ringColor={outlineColor ?? 'none'}  ringOffset={2}/>
    </Tooltip>
  );
};

export default MemberAvatar;
