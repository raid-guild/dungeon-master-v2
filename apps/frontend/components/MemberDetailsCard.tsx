import React from 'react';
import _ from 'lodash';
import {
  Flex,
  Button,
  Text,
  Heading,
  HStack,
  VStack,
  Badge,
  Icon,
  Link as ChakraLink,
  Divider,
  Tooltip,
  Box,
} from '@raidguild/design-system';
import { useClipboard } from '@chakra-ui/react';
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
  const copyDiscord = useClipboard(_.get(member, 'discordHandle'));
  const copyEns = useClipboard(_.get(member, 'ensName'));
  const copyEth = useClipboard(_.get(member, 'ethAddress'));

  const memberLinks = [
    _.get(member, 'githubHandle', _.get(application, 'githubHandle')) && {
      href: `https://github.com/${_.get(
        member,
        'githubHandle',
        _.get(application, 'githubHandle')
      )}`,
      tooltip: `Go to ${_.get(
        member,
        'name',
        _.get(application, 'name')
      )}'s GitHub profile`,
      label: _.get(member, 'githubHandle', _.get(application, 'githubHandle')),
      icon: FaGithub,
    },
    _.get(member, 'twitterHandle', _.get(application, 'twitterHandle')) && {
      href: `https://twitter.com/${_.get(
        member,
        'twitterHandle',
        _.get(application, 'twitterHandle')
      )}`,
      tooltip: `Go to ${_.get(
        member,
        'name',
        _.get(application, 'name')
      )}'s Twitter profile`,
      label: _.get(
        member,
        'twitterHandle',
        _.get(application, 'twitterHandle')
      ),
      icon: FaTwitter,
    },
    _.get(member, 'discordHandle', _.get(application, 'discordHandle')) && {
      tooltip: `Go to ${_.get(
        member,
        'name',
        _.get(application, 'name')
      )}'s Discord profile`,
      label: _.get(
        member,
        'discordHandle',
        _.get(application, 'discordHandle')
      ),
      icon: FaDiscord,
      onClick: copyDiscord.onCopy,
    },
    (_.get(member, 'ethAddress', _.get(application, 'ethAddress')) !== '0x' ||
      _.get(member, 'ensName', _.get(application, 'ensAddress')) !== null) && {
      tooltip: _.get(member, 'ensName', _.get(application, 'ensName'))
        ? 'Copy ENS name'
        : 'Copy ETH address',
      label:
        _.get(member, 'ensName', _.get(application, 'ensName')) ||
        truncateAddress(
          _.get(member, 'ethAddress', _.get(application, 'ethAddress'))
        ),
      icon: FaEthereum,
      onClick: _.get(member, 'ensName', _.get(application, 'ethAddress'))
        ? copyEns.onCopy
        : copyEth.onCopy,
    },
  ].filter((x) => x);

  const skillBlocks = [
    {
      label: 'Primary Skills',
      skills: _.map(
        _.filter(_.get(member, 'skills', _.get(application, 'skills')), [
          'skillType',
          'PRIMARY',
        ]),
        'skill'
      ),
    },
    {
      label: 'Secondary Skills',
      skills: _.map(
        _.filter(_.get(member, 'skills', _.get(application, 'skills')), [
          'skillType',
          'SECONDARY',
        ]),
        'skill'
      ),
    },
  ];

  return (
    <Flex
      direction="column"
      w="70%"
      bg="gray.800"
      rounded="md"
      style={{ backdropFilter: 'blur(7px)' }}
      align="stretch"
      justify="space-between"
    >
      <VStack p={8} height="100%" align="stretch">
        {_.map(skillBlocks, (block) => (
          <Flex direction="column" flexGrow={1}>
            <Heading size="sm">{block.label}</Heading>
            <Flex
              direction="row"
              maxWidth="100%"
              wrap="wrap"
              paddingTop={2}
              alignItems="center"
              justifyContent="flex-start"
            >
              {_.map(block.skills, (skill) => (
                <Badge
                  marginX={1}
                  marginBottom={1}
                  color="raid"
                  bgColor="gray.700"
                  key={`${block.label}-${skill}`}
                >
                  {SKILLS_DISPLAY(skill)}
                </Badge>
              ))}
            </Flex>
          </Flex>
        ))}

        {_.get(application, 'introduction') && (
          <>
            <Divider paddingTop={2} width="100%" alignSelf="center" />
            <Text size="md">{_.get(application, 'introduction')}</Text>
          </>
        )}

        <Box py={4}>
          <Divider />
        </Box>

        <HStack wrap="wrap">
          {_.map(memberLinks, (link) => (
            <Tooltip label={_.get(link, 'tooltip')} size="sm">
              <Button
                as={ChakraLink}
                variant="outline"
                size="xs"
                color="white"
                leftIcon={<Icon as={_.get(link, 'icon')} color="white" />}
                target="_blank"
                rel="noreferrer noopener"
                href={_.get(link, 'href')}
                onClick={_.get(link, 'onClick')}
              >
                {_.get(link, 'label')}
              </Button>
            </Tooltip>
          ))}
        </HStack>
      </VStack>
    </Flex>
  );
};

export default MemberDetailsCard;
