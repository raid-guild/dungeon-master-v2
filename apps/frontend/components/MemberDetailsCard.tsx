import React, { useEffect } from 'react';
import _ from 'lodash';
import {
  Flex,
  Button,
  Card,
  Text,
  Heading,
  VStack,
  Badge,
  Icon,
  Link as ChakraLink,
  Divider,
  Tooltip,
  Box,
  useClipboard,
} from '@raidguild/design-system';
import { FaGithub, FaTwitter, FaDiscord, FaEthereum } from 'react-icons/fa';
import {
  truncateAddress,
  IMember,
  IApplication,
  SKILLS_DISPLAY,
} from '../utils';

interface MemberProps {
  member?: IMember;
  application?: IApplication;
}

const MemberDetailsCard: React.FC<MemberProps> = ({
  member,
  application,
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
      onClick: copyDiscord.onCopy,
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
      onClick: copyEth.onCopy,
    },
  ].filter((x) => x);

  const skillsByType = (skills, type) =>
    _.map(_.filter(skills, ['skillType.skillType', type]), 'skill');

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
    <Box minW={[null, null, null, '600px']} w={['100%', null, null, '60%']}>
      <Card variant='filled' w='100%'>
        <VStack p={8} height='100%' align='stretch'>
          {_.map(skillBlocks, (block) => (
            <Flex direction='column' flexGrow={1} key={block.label}>
              <Heading color='white' size='sm'>
                {block.label}
              </Heading>
              <Flex
                direction='row'
                maxWidth='100%'
                wrap='wrap'
                paddingTop={2}
                alignItems='center'
                justifyContent='flex-start'
              >
                {_.map(block.skills, (skill) => (
                  <Badge
                    marginX={1}
                    marginBottom={1}
                    bgColor='gray.700'
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
              <Divider paddingTop={2} width='100%' alignSelf='center' />
              <Text size='md'>{_.get(application, 'introduction')}</Text>
            </>
          )}

          <Box py={4}>
            <Divider />
          </Box>

          <Flex gap={4} direction={['column', null, null, 'row']} wrap='wrap'>
            {_.map(memberLinks, (link) => (
              <Tooltip
                label={_.get(link, 'tooltip')}
                size='sm'
                key={_.get(link, 'label')}
              >
                <Button
                  as={ChakraLink}
                  variant='outline'
                  size='xs'
                  color='white'
                  leftIcon={<Icon as={_.get(link, 'icon')} color='white' />}
                  target='_blank'
                  rel='noreferrer noopener'
                  href={_.get(link, 'href')}
                  onClick={_.get(link, 'onClick')}
                >
                  {_.get(link, 'label')}
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
