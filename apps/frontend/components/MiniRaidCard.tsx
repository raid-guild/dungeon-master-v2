import _ from 'lodash';
import {
  Badge,
  Flex,
  Heading,
  Stack,
  HStack,
  Text,
} from '@raidguild/design-system';
import { format } from 'date-fns';
import { IRaid } from '../types';
import ChakraNextLink from './ChakraNextLink';
import MemberAvatar from './MemberAvatar';

type MiniRaidCardProps = {
  newRaid?: boolean;
  raid: IRaid;
};

const MiniRaidCard = ({ raid, newRaid }: MiniRaidCardProps) => (
  <ChakraNextLink href={`/raids/${_.get(raid, 'id')}`}>
    <Flex
      align="center"
      justify="space-between"
      border="1px solid"
      borderColor="whiteAlpha.500"
      borderRadius={15}
      minH="100px"
      p={4}
    >
      <Stack spacing={2}>
        <Heading size="md">{_.get(raid, 'name')}</Heading>
        <HStack>
          <Badge>{_.get(raid, 'raidStatus.raidStatus')}</Badge>
          {newRaid && _.get(raid, 'createdAt') && (
            <Text>{format(new Date(_.get(raid, 'createdAt')), 'Pp')}</Text>
          )}
        </HStack>
      </Stack>
      <MemberAvatar member={_.get(raid, 'cleric')} />
    </Flex>
  </ChakraNextLink>
);

export default MiniRaidCard;
