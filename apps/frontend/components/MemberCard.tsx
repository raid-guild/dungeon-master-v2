import * as React from 'react';
import _ from 'lodash';
import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  VStack,
  Badge,
  Link as ChakraLink,
  LinkBox,
  LinkOverlay,
  Divider,
  Tooltip,
  RoleBadge,
} from '@raidguild/design-system';
import { useClipboard } from '@chakra-ui/react';
import Link from './ChakraNextLink';
import {
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaEthereum,
  FaTelegramPlane,
} from 'react-icons/fa';
import {
  GUILD_CLASS_ICON,
  IApplication,
  IMember,
  truncateAddress,
  clearNonObjects,
} from '../utils';

// unused props are commented out for now
interface MemberProps {
  application: IApplication;
  member?: IMember;
}

const SocialButton = ({ href, icon, label, tooltip, onClick }) => (
  <Tooltip label={tooltip} size="sm" hasArrow>
    <Button
      as={ChakraLink}
      variant="ghost"
      size="xs"
      marginX={1}
      marginTop={1}
      leftIcon={icon}
      target="_blank"
      rel="noreferrer noopener"
      href={href}
      onClick={onClick}
      color="primary.300"
    >
      {label}
    </Button>
  </Tooltip>
);

const MemberCard: React.FC<MemberProps> = ({
  application,
  member,
}: MemberProps) => {
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
    ethAddress !== '0x'
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

  return (
    <LinkBox>
      <Flex
        direction="column"
        width="100%"
        bg="gray.800"
        rounded="md"
        minHeight="40vh"
        style={{ backdropFilter: 'blur(7px)' }}
        align="stretch"
        justify="space-between"
        position="relative"
      >
        <Link href={link}>
          <LinkOverlay>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              bgGradient="linear-gradient(96.18deg, #FF3864 -44.29%, #8B1DBA 53.18%, #4353DF 150.65%);"
              minHeight="70px"
              borderTopRadius="md"
            >
              <HStack
                spacing={4}
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                paddingX={4}
                paddingTop={4}
              >
                <Heading
                  color="white"
                  as="h3"
                  fontSize="2xl"
                  transition="all ease-in-out .25s"
                  _hover={{ cursor: 'pointer', color: 'raid' }}
                >
                  {_.get(member, 'name', _.get(application, 'name'))}
                </Heading>
                <Badge background="blackAlpha" fontSize="sm">
                  {isRaiding === true ? '⚔️ Raiding' : ' ⛺️ Not Raiding'}
                </Badge>
              </HStack>
            </Flex>
          </LinkOverlay>
        </Link>
        <VStack paddingX={8} height="100%" align="stretch">
          {/* <Flex flexGrow={1}>
            <Flex
              direction="row"
              maxWidth="100%"
              wrap="wrap"
              paddingTop={8}
              alignItems="center"
              justifyContent="flex-start"
            >
              {primarySkills?.map((skill) => (
                <Badge
                  marginX={1}
                  marginBottom={1}
                  color="raid"
                  bgColor="gray.700"
                  key={`${name}-${skill}`}
                >
                  {skill}
                </Badge>
              ))}
            </Flex>
          </Flex> */}
          <Divider paddingTop={2} width="100%" alignSelf="center" />
          <Text size="md" maxW="900px">
            {_.gte(_.size(_.get(application, 'introduction')), 250)
              ? _.get(application, 'introduction').slice(0, 250) + '...'
              : _.get(application, 'introduction')}
          </Text>

          <Flex wrap="wrap" width="100%" maxWidth="100%" paddingBottom={4}>
            {_.map(
              clearNonObjects(socials),
              ({ href, icon, label, tooltip, onClick }) => (
                <SocialButton
                  key={`${label}-${href}`}
                  href={href}
                  icon={icon}
                  label={label}
                  tooltip={tooltip}
                  onClick={onClick}
                />
              )
            )}
          </Flex>
        </VStack>
        {member && (
          <Flex position="absolute" top="40px" left="47%" zIndex={2}>
            <RoleBadge
              roleName={
                GUILD_CLASS_ICON[_.get(member, 'guildClass.guildClass')]
              }
              width="60px"
              height="60px"
            />
          </Flex>
        )}
      </Flex>
    </LinkBox>
  );
};

export default MemberCard;
