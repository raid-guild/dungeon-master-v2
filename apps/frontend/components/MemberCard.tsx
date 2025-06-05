import {
  Divider,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  RoleBadge,
  Stack,
  Text,
  useClipboard,
  VStack,
} from '@raidguild/design-system';
import { IApplication, IMember } from '@raidguild/dm-types';
import {
  clearNonObjects,
  GUILD_CLASS_ICON,
  truncateAddress,
} from '@raidguild/dm-utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@raidguild/ui';
import _ from 'lodash';
import { ReactElement, useEffect } from 'react';
import {
  FaDiscord,
  FaEthereum,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
} from 'react-icons/fa';

import Link from './ChakraNextLink';

// unused props are commented out for now
interface MemberProps {
  application: IApplication;
  member?: IMember;
}

const SocialButton = ({
  href,
  icon,
  label,
  tooltip,
  onClick,
}: {
  href: string;
  icon: ReactElement;
  label: string;
  tooltip: string;
  onClick?: () => void;
}) => (
  <Tooltip>
    <TooltipTrigger>
      <Button
        className='text-primary-300 hover:text-primary-400'
        asChild
        variant='link'
        size='sm'
        onClick={onClick}
      >
        <Link href={href} target='_blank' rel='noreferrer noopener'>
          {icon}
          {label}
        </Link>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

const MemberCard = ({ application, member }: MemberProps) => {
  const id = _.get(member, 'id', _.get(application, 'id'));
  const address = _.get(member, 'ethAddress', _.get(application, 'ethAddress'));
  const link = member ? `/members/${address}/` : `/applications/${id}/`;
  // const ensName = _.get(member, 'ensName', _.get(application, 'ensName', null));
  const ethAddress = _.get(
    member,
    'ethAddress',
    _.get(application, 'ethAddress')
  );
  const isRaiding = _.get(member, 'isRaiding', false);

  const github = _.get(
    member,
    'contactInfo.github',
    _.get(application, 'contactInfo.github')
  );
  const twitter = _.get(
    member,
    'contactInfo.twitter',
    _.get(application, 'contactInfo.twitter')
  );
  const discord = _.get(
    member,
    'contactInfo.discord',
    _.get(application, 'contactInfo.discord')
  );
  const telegram = _.get(
    member,
    'contactInfo.telegram',
    _.get(application, 'contactInfo.telegram')
  );
  const copyDiscord = useClipboard(discord);
  // const copyEns = useClipboard(ensName);
  const copyEth = useClipboard(ethAddress);

  useEffect(() => {
    copyDiscord.setValue(discord);

    copyEth.setValue(ethAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, application]);

  const socials = [
    !!telegram && {
      href: `https://t.me/${telegram}`,
      icon: <FaTelegramPlane />,
      label: telegram,
      tooltip: `Go to ${_.get(member, 'name')}'s Telegram profile`,
    },
    !!github && {
      href: `https://github.com/${github}`,
      icon: <FaGithub />,
      label: github,
      tooltip: '',
    },
    !!twitter && {
      href: `https://twitter.com/${twitter}`,
      icon: <FaTwitter />,
      label: twitter,
      tooltip: `Go to ${_.get(member, 'name')}'s Twitter profile`,
    },
    !!discord && {
      onClick: copyDiscord.onCopy,
      icon: <FaDiscord />,
      label: discord,
      tooltip: copyDiscord.hasCopied
        ? 'Copied Discord handle'
        : 'Copy Discord handle',
    },
    ethAddress !== '0x' && ethAddress
      ? {
          onClick: copyEth.onCopy,
          icon: <FaEthereum />,
          label: truncateAddress(ethAddress),
          tooltip: copyEth.hasCopied
            ? 'Copied eth address'
            : 'Copy eth address',
        }
      : null,
  ];
  const memberType = _.get(member, 'memberType.memberType');

  return (
    <LinkBox h='100%'>
      <Card className='min-h-[350px] h-full w-full'>
        <CardHeader>
          <Link href={link}>
            <div className='flex justify-between items-center w-full'>
              <h3 className='text-white text-2xl transition-all ease-in-out .25s hover:cursor-pointer hover:text-raid'>
                {_.get(member, 'name', _.get(application, 'name'))}
              </h3>
              <div className='flex flex-col justify-end'>
                {_.get(member, 'name') && (
                  <Badge className='text-sm'>
                    {isRaiding === true ? '⚔️ Raiding' : ' ⛺️ Not Raiding'}
                  </Badge>
                )}
                <Badge className='mx-1 mb-1 bg-gray-700'>{memberType}</Badge>
              </div>
            </div>
          </Link>
        </CardHeader>
        <CardContent>
          <div className='h-full w-full flex flex-col justify-between'>
            <RoleListDivider member={member} />
            <div className='flex flex-col gap-4'>
              <Separator className='mt-2 w-full self-center' />
              <p className='text-md max-w-[900px]'>
                {_.truncate(_.get(application, 'description'), {
                  length: 250,
                }) ||
                  _.truncate(_.get(application, 'introduction'), {
                    length: 250,
                  })}
              </p>
            </div>
            <div className='flex flex-wrap w-full max-w-full'>
              {_.map(
                clearNonObjects(socials),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ({ href, icon, label, tooltip, onClick }: any, i: number) => (
                  <SocialButton
                    key={`${label}-${href}-${i}`}
                    href={href}
                    icon={icon}
                    label={label}
                    tooltip={tooltip}
                    onClick={onClick}
                  />
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </LinkBox>
  );
};

const RoleListDivider = ({ member }: { member: IMember }) => (
  <HStack
    justifyContent='center'
    w='100%'
    pos='absolute'
    top='60px'
    transform='translate(-50%, 0)'
    left='50%'
  >
    {_.map(
      _.map(_.get(member, 'membersGuildClasses'), 'guildClassKey'),
      (role) => (
        <RoleBadge
          border='3px solid'
          roleName={GUILD_CLASS_ICON[role]}
          width='50px'
          height='50px'
        />
      )
    )}
  </HStack>
);

export default MemberCard;
