import _ from 'lodash';
import {
  Flex,
  Avatar,
  RoleBadge,
  Badge,
  Heading,
  Button,
  HStack,
  Text,
} from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useEnsAvatar } from 'wagmi';
import useMemberDetail from '../../hooks/useMemberDetail';
import SiteLayout from '../../components/SiteLayout';
import { memberDisplayName, GUILD_CLASS_ICON } from '../../utils';
import MemberDetailsCard from '../../components/MemberDetailsCard';

const Member = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: member } = useMemberDetail({ token });
  const { data: ensAvatar } = useEnsAvatar({
    address: _.get(member, 'ethAddress'),
    chainId: 1,
    enabled: _.get(member, 'ethAddress') !== '0x',
  });
  console.log('member details: ', member);

  return (
    <>
      <NextSeo title="Member" />

      <SiteLayout
        subheader={
          <Flex justify="space-between" align="center" w="100%">
            {ensAvatar ? (
              <Avatar size="lg" bg="black" src={ensAvatar} />
            ) : (
              _.get(member, 'guildClass') && (
                <Avatar
                  size="lg"
                  bg="black"
                  icon={
                    <RoleBadge
                      roleName={
                        GUILD_CLASS_ICON[_.get(member, 'guildClass.guildClass')]
                      }
                      height="64px"
                      width="64px"
                    />
                  }
                />
              )
            )}
            <Heading>{memberDisplayName(member)}</Heading>
            <HStack>
              <Badge background="blackAlpha" fontSize="sm">
                {_.get(member, 'isRaiding') === true ? (
                  <Text>⚔️ Raiding</Text>
                ) : (
                  <Text>⛺️ Not Raiding</Text>
                )}
              </Badge>
              <Button variant="outline">Edit</Button>
            </HStack>
          </Flex>
        }
      >
        <Flex>
          <MemberDetailsCard
            member={member}
            application={_.get(member, 'application')}
          />
          {/* <RaidsFeed /> */}
          <Flex
            direction="column"
            w="30%"
            ml="4"
            bg="gray.800"
            rounded="md"
            style={{ backdropFilter: 'blur(7px)' }}
            p={8}
          >
            <Heading size="sm">Active Raids</Heading>
            <Heading size="sm">Past Raids</Heading>
          </Flex>
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Member;
