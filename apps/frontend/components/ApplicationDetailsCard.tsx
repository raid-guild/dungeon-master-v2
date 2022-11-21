import * as React from 'react';
import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  VStack,
  Badge,
  Avatar,
  Link as Chakralink,
  Divider,
  Tooltip,
} from '@raidguild/design-system';
import { useClipboard } from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaDiscord, FaEthereum } from 'react-icons/fa';
import { IApplication } from '../utils';

import { truncateAddress } from '../utils/general';

type ApplicationProps = IApplication;

const ApplicationDetailsCard: React.FC<ApplicationProps> = ({
  id,
  name,
  guildClass,
  primarySkills,
  secondarySkills,
  ethAddress,
  discordHandle,
  twitterHandle,
  githubHandle,
  ensName,
  introduction,
}: ApplicationProps) => {
  const copyDiscord = useClipboard(discordHandle);
  const copyEns = useClipboard(ensName);
  const copyEth = useClipboard(ethAddress);

  return (
    <Flex
      direction="column"
      width="100%"
      bg="gray.800"
      rounded="md"
      style={{ backdropFilter: 'blur(7px)' }}
      align="stretch"
      justify="space-between"
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear-gradient(96.18deg, #FF3864 -44.29%, #8B1DBA 53.18%, #4353DF 150.65%);"
        minHeight="20%"
        borderTopRadius="md"
      >
        <HStack
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          paddingX={4}
          paddingTop={4}
        >
          <HStack spacing={10}>
            {/* <RoleBadge roleName={GUILD_CLASS_ICON[_.get(application, 'guildClass'))]} /> */}
            <VStack align="flex-start">
              <Heading
                color="white"
                as="h3"
                fontSize="2xl"
                padding={0}
                margin={0}
              >
                {name}
              </Heading>
              {/* {ethAddress !== undefined && (
                <>
                  <Tooltip
                    label={
                      copyEns.hasCopied
                        ? `Copied ${ensName ? 'ENS name' : 'eth address'}`
                        : `Copy ${ensName ? 'ENS name' : 'eth address'}`
                    }
                    size='xs'
                    arrowShadowColor='purple.500'
                    backgroundColor='purple.500'
                    color='purple.100'
                  >
                    <Button
                      colorScheme='blackAlpha'
                      bgColor='transparent'
                      color='white'
                      size='sm'
                      leftIcon={<FaEthereum />}
                      padding={0}
                      margin={0}
                      width='100%'
                      onClick={ensName ? copyEns.onCopy : copyEth.onCopy}
                    >
                      {ensName || truncateAddress(ethAddress)}
                    </Button>
                  </Tooltip>
                </>
              )} */}
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
                        as={Chakralink}
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
                        as={Chakralink}
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
                        as={Chakralink}
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
          </HStack>
        </HStack>
      </Flex>

      <VStack paddingX={8} height="100%" align="stretch" paddingY={4}>
        <Flex direction="column" flexGrow={1}>
          <Text color="white" fontSize="sm">
            Primary Skills:
          </Text>
          <Flex
            direction="row"
            maxWidth="100%"
            wrap="wrap"
            paddingTop={2}
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
        </Flex>
        <Flex direction="column" flexGrow={1}>
          <Text color="white" fontSize="sm">
            {' '}
            Secondary Skills
          </Text>
          <Flex
            direction="row"
            maxWidth="100%"
            wrap="wrap"
            paddingTop={2}
            alignItems="center"
            justifyContent="flex-start"
          >
            {secondarySkills?.map((skill) => (
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
        </Flex>
        <Divider paddingTop={2} width="100%" alignSelf="center" />
        {introduction && <Text size="md">{introduction}</Text>}
      </VStack>
    </Flex>
  );
};

export default ApplicationDetailsCard;
