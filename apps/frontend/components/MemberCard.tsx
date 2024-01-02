import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  LinkBox,
  LinkOverlay,
  RoleBadge,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from '@raidguild/design-system';
import { IApplication, IMember } from '@raidguild/dm-types';
import {
  clearNonObjects,
  GUILD_CLASS_ICON,
  truncateAddress,
} from '@raidguild/dm-utils';
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
  <Tooltip label={tooltip} size='sm' hasArrow>
    <Button
      as={ChakraLink}
      variant='ghost'
      size='xs'
      marginX={1}
      marginTop={1}
      zIndex={2}
      leftIcon={icon}
      target='_blank'
      rel='noreferrer noopener'
      href={href}
      onClick={onClick}
      color='primary.300'
    >
      {label}
    </Button>
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
    telegram && {
      href: `https://t.me/${telegram}`,
      icon: <FaTelegramPlane />,
      label: telegram,
      tooltip: `Go to ${_.get(member, 'name')}'s Telegram profile`,
    },
    github && {
      href: `https://github.com/${github}`,
      icon: <FaGithub />,
      label: github,
      tooltip: '',
    },
    twitter && {
      href: `https://twitter.com/${twitter}`,
      icon: <FaTwitter />,
      label: twitter,
      tooltip: `Go to ${_.get(member, 'name')}'s Twitter profile`,
    },
    discord && {
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
      <Card
        variant='withHeader'
        minH='350px'
        h='100%'
        centerDivider={
          member &&
          _.get(member, 'guildClass.guildClass') && (
            <RoleBadge
              roleName={
                GUILD_CLASS_ICON[_.get(member, 'guildClass.guildClass')]
              }
              width='60px'
              height='60px'
            />
          )
        }
        heading={
          <LinkOverlay as={Link} href={link}>
            <HStack
              spacing={4}
              alignItems='center'
              justifyContent='space-between'
              width='100%'
            >
              <Heading
                color='white'
                as='h3'
                fontSize='2xl'
                transition='all ease-in-out .25s'
                _hover={{ cursor: 'pointer', color: 'raid' }}
              >
                {_.get(member, 'name', _.get(application, 'name'))}
              </Heading>
              <VStack align='end'>
                {_.get(member, 'name') && (
                  <Badge background='blackAlpha' fontSize='sm'>
                    {isRaiding === true ? '⚔️ Raiding' : ' ⛺️ Not Raiding'}
                  </Badge>
                )}
                <Badge
                  marginX={1}
                  marginBottom={1}
                  color='raid'
                  bgColor='gray.700'
                >
                  {memberType}
                </Badge>
              </VStack>
            </HStack>
          </LinkOverlay>
        }
        width='100%'
      >
        <Flex
          height='100%'
          align='stretch'
          width='100%'
          direction='column'
          justify='space-between'
        >
          <Stack spacing={4}>
            <Divider paddingTop={2} width='100%' alignSelf='center' />
            <Text size='md' maxW='900px'>
              {_.gte(_.size(_.get(application, 'introduction')), 250)
                ? `${_.get(application, 'introduction').slice(0, 250)}...`
                : _.get(application, 'introduction')}
            </Text>
          </Stack>

          <Flex wrap='wrap' width='100%' maxWidth='100%'>
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
          </Flex>
        </Flex>
      </Card>
    </LinkBox>
  );
};

export default MemberCard;
