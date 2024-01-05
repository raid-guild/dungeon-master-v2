import {
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from '@raidguild/design-system';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import { displayDate } from '@raidguild/dm-utils';
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
  const specLink =
    _.chain(consultation?.links)
      .filter(
        (x) =>
          _.get(x, 'linkType.type') === 'SPECIFICATION' && !!_.get(x, 'link')
      )
      .map((x) => _.get(x, 'link'))
      .head()
      .value() ?? consultation?.link;
  return (
    <ChakraNextLink
      href={
        raid
          ? `/raids/${_.get(raid, 'id')}`
          : `/consultations/${_.get(consultation, 'id')}`
      }
    >
      <Card variant='outline' width='100%' minH='100px'>
        <Flex width='100%' h='100%'>
          <Stack spacing={2} w='100%' gap={4}>
            <Heading
              color='white'
              size={smallHeader ? 'sm' : 'md'}
              noOfLines={1}
            >
              {_.get(raid, 'name', _.get(consultation, 'name'))}
            </Heading>
            <Flex justify='space-between' w='100%'>
              <HStack gap={3}>
                {_.get(raid, 'raidStatus.raidStatus') && (
                  <RaidStatusBadge
                    status={_.get(raid, 'raidStatus.raidStatus')}
                  />
                )}
                <Box zIndex={100}>
                  {specLink && <LinkExternal href={specLink} label='Specs' />}
                </Box>
              </HStack>
              <Text size='sm' color='whiteAlpha.700'>
                Updated: {displayDate(_.get(raid, 'updatedAt'))}
              </Text>
            </Flex>
          </Stack>
        </Flex>
      </Card>
    </ChakraNextLink>
  );
};

export default MiniRaidCard;
