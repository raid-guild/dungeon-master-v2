import _ from 'lodash';
import { Flex, Heading, Stack, HStack, Text } from '@raidguild/design-system';
import { format } from 'date-fns';
import { IRaid, IConsultation } from '../types';
import ChakraNextLink from './ChakraNextLink';
import MemberAvatar from './MemberAvatar';
import RaidStatusBadge from './RaidStatusBadge';

type MiniRaidCardProps = {
  consultation?: IConsultation;
  raid?: IRaid;
  newRaid?: boolean;
  noAvatar?: boolean;
  smallHeader?: boolean;
};

const MiniRaidCard = ({
  consultation,
  raid,
  newRaid,
  noAvatar,
  smallHeader,
}: MiniRaidCardProps) => (
  <ChakraNextLink
    href={
      raid
        ? `/raids/${_.get(raid, 'id')}`
        : `/consultations/${_.get(consultation, 'id')}`
    }
  >
    <Flex
      align="center"
      justify="space-between"
      border="1px solid"
      borderColor="whiteAlpha.500"
      borderRadius={15}
      p={4}
    >
      <Stack spacing={2}>
        <Heading size={smallHeader ? 'sm' : 'md'}>
          {_.get(raid, 'name', _.get(consultation, 'name'))}
        </Heading>
        <HStack>
          <RaidStatusBadge status={_.get(raid, 'raidStatus.raidStatus')} />
          {newRaid &&
            _.get(raid, 'createdAt', _.get(consultation, 'createdAt')) && (
              <Text>
                {format(
                  new Date(
                    _.get(raid, 'createdAt', _.get(consultation, 'createdAt'))
                  ),
                  'Pp'
                )}
              </Text>
            )}
        </HStack>
      </Stack>
      {!noAvatar && <MemberAvatar member={_.get(raid, 'cleric')} />}
    </Flex>
  </ChakraNextLink>
);

export default MiniRaidCard;
