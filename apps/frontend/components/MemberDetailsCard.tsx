import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  Stack,
  Text,
  useClipboard,
  VStack,
} from '@raidguild/design-system';
import { IApplication, IMember } from '@raidguild/dm-types';
import { SKILLS_DISPLAY, truncateAddress } from '@raidguild/dm-utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@raidguild/ui';
import { cn } from '@raidguild/utils';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { FaDiscord, FaEthereum, FaGithub, FaTwitter } from 'react-icons/fa';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useOverlay } from '../contexts/OverlayContext';
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
  const copyDiscord = useClipboard(
    _.get(
      member,
      'contactInfo.discord',
      _.get(application, 'contactInfo.discord')
    )
  );
  const copyEth = useClipboard(
    _.get(member, 'ethAddress', _.get(application, 'ethAddress'))
  );

  const copyAndNotify = (value: string) => {
    if (value === 'discord') {
      copyDiscord.onCopy();
      toast.success('Copied Discord username to clipboard');
    } else if (value === 'eth') {
      copyEth.onCopy();
      toast.success('Copied ETH address to clipboard');
    }
  };

  useEffect(() => {
    copyDiscord.setValue(
      _.get(member, 'contactInfo.discord') ??
        _.get(application, 'contactInfo.discord')
    );

    copyEth.setValue(
      _.get(member, 'ethAddress') ?? _.get(application, 'ethAddress')
    );
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
      icon: FaGithub,
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
      icon: FaTwitter,
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
      icon: FaDiscord,
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
      icon: FaEthereum,
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
            <div className='flex w-full space-between'>
              <MemberAvatar
                member={member}
                size={16}
                outlineColor='primary.500'
              />
              <div className='flex flex-col self-end'>
                <h1 className='text-lg text-white'>
                  {_.get(member, 'name', _.get(application, 'name'))}
                </h1>
                <Tooltip>
                  <TooltipTrigger>
                    <Button type='button' onClick={() => copyAndNotify('eth')}>
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

            <div className='flex full items-center'>
              <Button className='w-full'>
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
          <div className='flex flex-col w-full items-center justify-start space-y-6'>
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
                <Divider color='gray.200' />
                <Description
                  description={
                    _.get(member, 'description') ||
                    _.get(application, 'introduction')
                  }
                />
              </>
            )}

            <Divider my={2} />

            <Flex gap={4} direction='row' wrap='wrap'>
              {_.map(memberLinks, (link) => (
                <Tooltip
                  label={_.get(link, 'tooltip')}
                  size='sm'
                  key={`${_.get(link, 'href')}-${_.get(link, 'label')}`}
                >
                  <Button
                    as={ChakraLink}
                    variant='outline'
                    size='xs'
                    color='white'
                    p={3}
                    leftIcon={<Icon as={_.get(link, 'icon')} />}
                    target='_blank'
                    rel='noreferrer noopener'
                    href={_.get(link, 'href')}
                    onClick={_.get(link, 'onClick')}
                  >
                    <Text fontFamily='texturina'>
                      {_.capitalize(_.get(link, 'label'))}
                    </Text>
                  </Button>
                </Tooltip>
              ))}
            </Flex>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetailsCard;
