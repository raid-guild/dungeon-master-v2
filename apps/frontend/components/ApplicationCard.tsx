import * as React from 'react';
import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  VStack,
  Badge,
  // Avatar,
  Link as ChakraLink,
  LinkBox,
  LinkOverlay,
  Divider,
  Tooltip,
  // RoleBadge,
} from '@raidguild/design-system';
import { useClipboard } from '@chakra-ui/react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaDiscord, FaEthereum } from 'react-icons/fa';
import { IApplication } from '../utils';
import { truncateAddress } from '../utils/general';

// unused props are commented out for now
type ApplicationProps = IApplication;

const ApplicationCard: React.FC<ApplicationProps> = ({
  id,
  name,
  guildClass,
  primarySkills,
  ethAddress,
  discordHandle,
  twitterHandle,
  githubHandle,
  ensName,
  skillType,

  learningGoals,
  daoFamiliarity,
  handbookRead,
  cryptoExp,
}: ApplicationProps) => {
  const copyDiscord = useClipboard(discordHandle);
  const copyEns = useClipboard(ensName);
  const copyEth = useClipboard(ethAddress);

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
      >
        <Link href="/applications/[id]" as={`/applications/${id}/`} passHref>
          <LinkOverlay>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              bgGradient="linear-gradient(96.18deg, #FF3864 -44.29%, #8B1DBA 53.18%, #4353DF 150.65%);"
              minHeight="20%"
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
                <VStack align="flex-start">
                  <Heading
                    color="white"
                    as="h3"
                    fontSize="2xl"
                    transition="all ease-in-out .25s"
                    _hover={{ cursor: 'pointer', color: 'raid' }}
                  >
                    {name}
                  </Heading>
                  <Text fontWeight="normal">{skillType}</Text>
                </VStack>
                <VStack>
                  <Badge background="blackAlpha" fontSize="sm">
                    Applicant
                  </Badge>
                  {handbookRead !== null && true && (
                    <>
                      <Tooltip
                        label={`${name} has read the Raid Guild Handbook.`}
                        size="sm"
                        arrowShadowColor="purple.500"
                        backgroundColor="purple.500"
                        color="purple.100"
                      >
                        <Text background="blackAlpha" fontSize="sm">
                          📜
                        </Text>
                      </Tooltip>
                    </>
                  )}
                </VStack>
              </HStack>
            </Flex>
          </LinkOverlay>
        </Link>
        <VStack paddingX={8} height="100%" align="stretch">
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
          {cryptoExp !== null && (
            <Text fontSize="sm" color="whiteAlpha.800">
              {cryptoExp} {cryptoExp === `I'm an OG` ? '' : 'years experience'}{' '}
              in crypto
            </Text>
          )}
          {daoFamiliarity !== null && (
            <Text fontSize="sm" color="whiteAlpha.800">
              I am {daoFamiliarity === 'Expert' ? 'an' : ''} {daoFamiliarity}{' '}
              with DAOs
            </Text>
          )}
          <Divider paddingTop={2} width="100%" alignSelf="center" />
          <Text as="span" color="whiteAlpha.800">
            {learningGoals}
          </Text>

          <Flex wrap="wrap" width="100%" maxWidth="100%" paddingBottom={4}>
            {githubHandle !== null && (
              <>
                <Tooltip
                  label={`Go to ${name}'s GitHub profile`}
                  size="sm"
                  arrowShadowColor="purple.500"
                  backgroundColor="purple.500"
                  color="purple.100"
                >
                  <Button
                    as={ChakraLink}
                    colorScheme="blackAlpha"
                    bgColor="black"
                    color="white"
                    size="xs"
                    marginX={1}
                    marginTop={1}
                    leftIcon={<FaGithub />}
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`https://github.com/${githubHandle}`}
                  >
                    {githubHandle}
                  </Button>
                </Tooltip>
              </>
            )}
            {twitterHandle !== undefined && (
              <>
                <Tooltip
                  label={`Go to ${name}'s Twitter profile`}
                  size="sm"
                  arrowShadowColor="purple.500"
                  backgroundColor="purple.500"
                  color="purple.100"
                >
                  <Button
                    as={ChakraLink}
                    colorScheme="twitter"
                    size="xs"
                    marginX={1}
                    marginTop={1}
                    leftIcon={<FaTwitter />}
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`https://twitter.com/${twitterHandle}`}
                  >
                    {twitterHandle}
                  </Button>
                </Tooltip>
              </>
            )}
            {discordHandle !== undefined && (
              <>
                <Tooltip
                  label={
                    copyDiscord.hasCopied
                      ? 'Copied Discord handle'
                      : 'Copy Discord handle'
                  }
                  size="sm"
                  arrowShadowColor="purple.500"
                  backgroundColor="purple.500"
                  color="purple.100"
                >
                  <Button
                    as={ChakraLink}
                    bgColor="purple.800"
                    _hover={{ bgColor: 'purple.500' }}
                    transition="all ease-in-out .25s"
                    color="white"
                    size="xs"
                    marginX={1}
                    marginTop={1}
                    leftIcon={<FaDiscord />}
                    onClick={copyDiscord.onCopy}
                  >
                    {discordHandle}
                  </Button>
                </Tooltip>
              </>
            )}
            {ethAddress !== undefined && (
              <>
                <Tooltip
                  label={
                    copyEns.hasCopied
                      ? `Copied ${ensName ? 'ENS name' : 'eth address'}`
                      : `Copy ${ensName ? 'ENS name' : 'eth address'}`
                  }
                  size="xs"
                  arrowShadowColor="purple.500"
                  backgroundColor="purple.500"
                  color="purple.100"
                >
                  <Button
                    colorScheme="blackAlpha"
                    bgColor="black"
                    color="white"
                    size="xs"
                    marginX={1}
                    marginTop={1}
                    leftIcon={<FaEthereum />}
                    onClick={ensName ? copyEns.onCopy : copyEth.onCopy}
                  >
                    {ensName || truncateAddress(ethAddress)}
                  </Button>
                </Tooltip>
              </>
            )}
          </Flex>
        </VStack>
      </Flex>
    </LinkBox>
  );
};

export default ApplicationCard;
