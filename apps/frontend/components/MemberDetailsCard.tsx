import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useToast,
  VStack,
} from '@raidguild/design-system';
import { IApplication, IMember } from '@raidguild/dm-types';
import { SKILLS_DISPLAY, truncateAddress } from '@raidguild/dm-utils';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { FaDiscord, FaEthereum, FaGithub, FaTwitter } from 'react-icons/fa';
import { useAccount } from 'wagmi';

import { useOverlay } from '../contexts/OverlayContext';
import MemberAvatar from './MemberAvatar';
import UpdateMemberForm from './MemberUpdateForm';
import ModalWrapper from './ModalWrapper';

interface MemberProps {
  application?: IApplication;
  height?: string;
  member?: IMember;
  showHeader?: boolean;
  width?: string;
}

const MemberDetailsCard = ({
  application,
  height,
  member,
  showHeader = false,
  width,
}: MemberProps) => {
  const toast = useToast();
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
      toast.success({ title: 'Copied Discord username to clipboard' });
    } else if (value === 'eth') {
      copyEth.onCopy();
      toast.success({ title: 'Copied ETH address to clipboard' });
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
    <Box
      minW={[null, null, null, '500px']}
      w={['100%', null, null, width ?? '60%']}
      h={height ?? 'max-content'}
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
      <Card variant='filled' w='100%' h={height ?? 'max-content'} p={4}>
        {showHeader && (
          <>
            <Flex w='100%' justifyContent='space-between'>
              <MemberAvatar
                member={member}
                size={16}
                outlineColor='primary.500'
              />
              <Stack align='flex-end'>
                <Heading size='lg' color='white'>
                  {_.get(member, 'name', _.get(application, 'name'))}
                </Heading>
                <Tooltip label='Copy ETH address' placement='left' hasArrow>
                  <HStack
                    spacing={1}
                    onClick={() => copyAndNotify('eth')}
                    _hover={{ cursor: 'pointer' }}
                    _active={{ textColor: 'primary.500' }}
                  >
                    <Text fontSize='sm' color='whiteAlpha.800'>
                      {truncateAddress(
                        _.get(
                          member,
                          'ethAddress',
                          _.get(application, 'ethAddress')
                        )
                      )}
                    </Text>

                    <Icon as={FaEthereum} />
                  </HStack>
                </Tooltip>
              </Stack>
            </Flex>

            <HStack w='100%' fontFamily='spaceMono'>
              <Button w='full'>
                {_.get(member, 'isRaiding') === true
                  ? 'RAIDING'
                  : 'NOT RAIDING'}
              </Button>
              <Button variant='outline' w='30%' onClick={handleShowUpdateModal}>
                Edit
              </Button>
            </HStack>
          </>
        )}
        <VStack
          w='100%'
          alignItems='flex-start'
          justifyContent='flex-start'
          spacing={6}
        >
          {_.map(skillBlocks, (block) => (
            <Flex direction='column' flexGrow={1} key={block.label} gap={2}>
              <Heading
                color='purple.400'
                fontFamily='texturina'
                textTransform='uppercase'
                size='xs'
              >
                {block.label}
              </Heading>
              <Flex maxWidth='100%' wrap='wrap'>
                {_.map(block.skills, (skill) => (
                  <Badge
                    mx={1}
                    mb={1}
                    p={1}
                    px={2}
                    bgColor='gray.700'
                    rounded={4}
                    key={`${block.label}-${_.get(skill, 'skill')}`}
                    color='white'
                  >
                    {SKILLS_DISPLAY(_.get(skill, 'skill'))}
                  </Badge>
                ))}
              </Flex>
            </Flex>
          ))}

          {_.get(application, 'introduction') && (
            <>
              <Divider color='gray.200' />
              <Text size='md'>{_.get(application, 'introduction')}</Text>
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
        </VStack>
      </Card>
    </Box>
  );
};

export default MemberDetailsCard;
