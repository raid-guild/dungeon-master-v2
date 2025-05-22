import { IMember } from '@raidguild/dm-types';
import { memberDisplayName } from '@raidguild/dm-utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@raidguild/ui';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useEnsAvatar, useEnsName } from 'wagmi';

type MemberAvatarProps = {
  member: Partial<IMember>;
  size?: 'sm' | 'md' | 'lg' | number;
  outlineColor?: string;
};

const MemberAvatar = ({
  member,
  size = 8,
  outlineColor,
}: MemberAvatarProps) => {
  const address = member?.ethAddress;
  const name = memberDisplayName(member);
  const github = member?.contactInfo?.github;

  // Fetch ENS Name and Avatar
  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
    query: { enabled: !!address },
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
    query: {
      enabled: !!ensName,
      gcTime: 60000, // Cache time in milliseconds
    },
  });

  // State for Blockies Avatar
  const [blockiesAvatar, setBlockiesAvatar] = useState<string>();

  // Generate Blockies Avatar as fallback
  useEffect(() => {
    if (address) {
      setBlockiesAvatar(blockies.create({ seed: address }).toDataURL());
    }
  }, [address]);

  // Guess ENS and GitHub Avatars
  const guessAlias = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const { data: guessedEnsAvatar } = useEnsAvatar({
    name: `${guessAlias}.eth`,
    chainId: 1,
  });
  // const guessedGithubAvatar = `https://github.com/${guessAlias}.png`;

  // eslint-disable-next-line no-nested-ternary
  const githubAvatar = _.isString(github)
    ? github?.startsWith('http')
      ? `${github.endsWith('/') ? github.slice(0, -1) : github}.png`
      : `https://github.com/${github}.png`
    : undefined; // guessedGithubAvatar;

  // Determine Final Avatar
  const finalAvatar =
    ensAvatar || githubAvatar || guessedEnsAvatar || blockiesAvatar; // || guessedEnsAvatar;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar className={`size-${size}`}>
          <AvatarImage src={finalAvatar || blockiesAvatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side={address ? 'left' : 'top'}>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MemberAvatar;
