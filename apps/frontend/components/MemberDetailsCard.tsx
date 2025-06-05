import { IApplication, IMember } from '@raidguild/dm-types';
import { SKILLS_DISPLAY, truncateAddress } from '@raidguild/dm-utils';
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
import { cn } from '@raidguild/utils';
import _ from 'lodash';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FaDiscord, FaEthereum, FaGithub, FaTwitter } from 'react-icons/fa';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useOverlay } from '../contexts/OverlayContext';
import useClipboard from '../hooks/useClipboard';
import Description from './Description';
import MemberAvatar from './MemberAvatar';
import UpdateMemberForm from './MemberUpdateForm';
import ModalWrapper from './ModalWrapper';

interface MemberProps {
  application?: IApplication;
  height?: string;
  member?: IMember;
  showHeader?: boolean;
  width?: string;
  minHeight?: string;
}

const MemberDetailsCard = ({
  application,
  height,
  member,
  showHeader = false,
  width,
  minHeight,
}: MemberProps) => {
  const [discordCopy, onDiscordCopy] = useClipboard();
  const [ethCopy, onEthCopy] = useClipboard();

  const copyAndNotify = (value: string) => {
    if (value === 'discord') {
      onDiscordCopy(
        _.get(
          member,
          'contactInfo.discord',
          _.get(application, 'contactInfo.discord')
        )
      );
      toast.success('Copied Discord username to clipboard');
    } else if (value === 'eth') {
      onEthCopy(_.get(member, 'ethAddress', _.get(application, 'ethAddress')));
      toast.success('Copied ETH address to clipboard');
    }
  };

  useEffect(() => {
    onDiscordCopy(
      _.get(member, 'contactInfo.discord') ??
        _.get(application, 'contactInfo.discord')
    );

    onEthCopy(_.get(member, 'ethAddress') ?? _.get(application, 'ethAddress'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, application]);

  const memberLinks = [
    _.get(
      member,
      'contactInfo.github',
      _.get(application, 'contactInfo.github')
    ) && {
      href: `https://github.com/${_.get(
        member,
        'contactInfo.github',
        _.get(application, 'contactInfo.github')
      )}`,
      tooltip: `Go to ${_.get(
        member,
        'name',
        _.get(application, 'name')
      )}'s GitHub profile`,
      label: _.get(
        member,
        'contactInfo.github',
        _.get(application, 'contactInfo.github')
      ),
      icon: <FaGithub />,
    },
    _.get(
      member,
      'contactInfo.twitter',
      _.get(application, 'contactInfo.twitter')
    ) && {
      href: `https://twitter.com/${_.get(
        member,
        'contactInfo.twitter',
        _.get(application, 'contactInfo.twitter')
      )}`,
      tooltip: `Go to ${_.get(
        member,
        'name',
        _.get(application, 'name')
      )}'s Twitter profile`,
      label: _.get(
        member,
        'contactInfo.twitter',
        _.get(application, 'contactInfo.twitter')
      ),
      icon: <FaTwitter />,
    },
    _.get(
      member,
      'contactInfo.discord',
      _.get(application, 'contactInfo.discord')
    ) && {
      tooltip: `Go to ${_.get(
        member,
        'name',
        _.get(application, 'name')
      )}'s Discord profile`,
      label: _.get(
        member,
        'contactInfo.discord',
        _.get(application, 'contactInfo.discord')
      ),
      icon: <FaDiscord />,
      onClick: () => copyAndNotify('discord'),
    },
    ((_.get(member, 'ethAddress', _.get(application, 'ethAddress')) !== '0x' &&
      _.get(member, 'ethAddress', _.get(application, 'ethAddress'))) ||
      _.get(member, 'ensName', _.get(application, 'ensAddress'))) && {
      tooltip: 'Copy ETH address',
      label:
        _.get(member, 'ensName', _.get(application, 'ensAddress')) ??
        truncateAddress(
          _.get(member, 'ethAddress', _.get(application, 'ethAddress'))
        ),
      icon: <FaEthereum />,
      onClick: () => copyAndNotify('eth'),
    },
  ].filter((x) => x);

  const skillsByType = (skills, type) =>
    _.map(_.filter(skills, ['skillType.skillType', type]), 'skill');

  const { address: memberAddress } = useAccount();

  const localOverlay = useOverlay();
  const { setModals, closeModals } = localOverlay;

  const handleShowUpdateModal = () => {
    setModals({ memberForm: true });
  };

  const localSkills = _.get(
    member,
    'membersSkills',
    _.get(application, 'applicationsSkills')
  );
  const skillBlocks = [
    _.size(skillsByType(localSkills, 'PRIMARY')) && {
      label: 'Primary Skills',
      skills: skillsByType(localSkills, 'PRIMARY'),
    },
    _.size(skillsByType(localSkills, 'SECONDARY')) && {
      label: 'Secondary Skills',
      skills: skillsByType(localSkills, 'SECONDARY'),
    },
  ].filter((x) => x);

  return (
    <div
      className={cn(
        'max-w-[500px]',
        `${width ? `w-[${width}]` : 'w-full'}  ${
          height ? `h-[${height}]` : 'h-max'
        } ${minHeight ? `min-h-[${minHeight}]` : 'min-h-full'}`
      )}
    >
      <ModalWrapper
        name='memberForm'
        size='xl'
        title='Update Member Details'
        localOverlay={localOverlay}
      >
        <UpdateMemberForm
          member={member}
          introduction={application?.introduction}
          memberAddress={memberAddress}
          memberId={_.get(member, 'id')}
          closeModal={closeModals}
        />
      </ModalWrapper>
      <Card
        className={cn(
          'w-full p-4',
          ` ${height ? `h-[${height}]` : 'h-max'}  ${
            minHeight ? `min-h-[${minHeight}]` : 'min-h-full'
          }`
        )}
      >
        {showHeader && (
          <CardHeader>
            <div className='flex w-full justify-between'>
              <MemberAvatar classNames='w-12 h-12' member={member} />
              <div className='flex flex-col items-center justify-center'>
                <h1 className='text-lg text-white'>
                  {_.get(member, 'name', _.get(application, 'name'))}
                </h1>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant='link'
                      type='button'
                      onClick={() => copyAndNotify('eth')}
                    >
                      {truncateAddress(
                        _.get(
                          member,
                          'ethAddress',
                          _.get(application, 'ethAddress')
                        )
                      )}
                      <FaEthereum />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    <p>Copy ETH address</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className='flex w-full items-center justify-evenly gap-2'>
              <Button type='button' className='flex-1'>
                {_.get(member, 'isRaiding') === true
                  ? 'RAIDING'
                  : 'NOT RAIDING'}
              </Button>
              <Button
                variant='outline'
                className='w-[30%]'
                onClick={handleShowUpdateModal}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
        )}
        <CardContent>
          <div className='flex flex-col w-full items-start space-y-6'>
            {_.map(skillBlocks, (block) => (
              <div className='flex flex-col flex-1 gap-2' key={block.label}>
                <p className='text-purple-400 font-texturina uppercase text-xs'>
                  {block.label}
                </p>
                <div className='flex flex-wrap max-w-full'>
                  {_.map(block.skills, (skill) => (
                    <Badge
                      className='mx-1 mb-1 p-1 px-2 bg-gray-700'
                      key={`${block.label}-${_.get(skill, 'skill')}`}
                    >
                      {SKILLS_DISPLAY(_.get(skill, 'skill'))}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            {(_.get(member, 'description') ||
              _.get(application, 'introduction')) && (
              <>
                <Separator className='my-2' />
                <Description
                  description={
                    _.get(member, 'description') ||
                    _.get(application, 'introduction')
                  }
                />
              </>
            )}

            <Separator className='my-2' />

            <div className='flex flex-wrap gap-4'>
              {_.map(memberLinks, (link) => (
                <Tooltip key={`${_.get(link, 'href')}-${_.get(link, 'label')}`}>
                  <TooltipTrigger>
                    <Button
                      asChild
                      variant='outline'
                      size='sm'
                      onClick={_.get(link, 'onClick')}
                    >
                      {_.get(link, 'href') ? (
                        <Link
                          href={_.get(link, 'href')}
                          target='_blank'
                          rel='noreferrer noopener'
                        >
                          {_.get(link, 'icon')}
                          {_.capitalize(_.get(link, 'label'))}
                        </Link>
                      ) : (
                        <div className='flex items-center gap-2'>
                          {_.get(link, 'icon')}
                          {_.capitalize(_.get(link, 'label'))}
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{_.get(link, 'tooltip')}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetailsCard;
