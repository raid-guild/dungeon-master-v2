import _ from 'lodash';
import { Card, Flex, Heading, Stack, HStack, Text } from '@raidguild/design-system';
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
    <Card
      variant="outline"
      width="100%"
    >
      <Stack spacing={2} width="100%">
        <Heading color="white" size={smallHeader ? 'sm' : 'md'}>
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
    </Card>
  </ChakraNextLink>
);

export default MiniRaidCard;
