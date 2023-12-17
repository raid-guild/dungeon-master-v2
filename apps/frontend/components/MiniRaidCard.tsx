import {
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text
} from '@raidguild/design-system';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';

import ChakraNextLink from './ChakraNextLink';
import LinkExternal from './LinkExternal';
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
}: MiniRaidCardProps) => {
  const specLink = _.chain(consultation?.links)
    .filter(x => _.get(x, 'linkType.type') === 'SPECIFICATION' && !!_.get(x, 'link'))
    .map(x => _.get(x, 'link'))
    .head()
    .value() ?? consultation?.link;

    console.log('consultation', consultation);
    console.log('specLink', specLink);
    console.log('raid', raid);

  return (
  
    <Card variant='outline' width='100%' minH='100px'>
      <Flex alignItems='center' width='100%' h='100%'>
      <ChakraNextLink
    href={
      raid
        ? `/raids/${_.get(raid, 'id')}`
        : `/consultations/${_.get(consultation, 'id')}`
    }
  >
        <Stack spacing={2} width='100%' gap={4}>
          <Heading color='white' size={smallHeader ? 'sm' : 'md'} >
            {_.get(raid, 'name', _.get(consultation, 'name'))}
          </Heading>
          <HStack gap={3}>
            {_.get(raid, 'raidStatus.raidStatus') && (
              <RaidStatusBadge status={_.get(raid, 'raidStatus.raidStatus')} />
            )}
            <Box zIndex={100}>
            <LinkExternal href={specLink} label='Specs' />
            </Box>
          </HStack>
        </Stack>
        </ChakraNextLink>
        <Spacer/>
        <Text>
        {_.get(raid, 'updatedAt')}
        </Text>
      </Flex>
    </Card>
  
  )}

export default MiniRaidCard;
