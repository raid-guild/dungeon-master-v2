import {
  Flex,
  Heading,
  ResponsiveValue,
  Stack,
  Text,
} from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';

import Link from '../ChakraNextLink';

const ProjectInfo = ({
  raid,
  direction,
}: {
  raid: IRaid;
  direction?: ResponsiveValue<'column' | 'row'>;
}) => {
  const clientName = _.get(
    raid,
    'consultation.consultationsContacts[0].contact.name'
  );

  return (
    <Flex
      direction={direction}
      justify='space-between'
      align={direction === 'column' ? 'flex-start' : 'center'}
      minW={{ base: 'none', lg: '400px' }}
    >
      <Heading size='md' fontFamily='spaceMono' color='white' maxWidth='400px'>
        {raid?.name}
      </Heading>

      <Stack
        align={direction === 'column' ? 'flex-start' : 'flex-end'}
        spacing={1}
      >
        <Heading size='sm' fontFamily='texturina' color='primary.300'>
          {clientName}
        </Heading>

        <Link href={`/raids/${raid?.id}`}>
          <Text
            color='gray.400'
            fontFamily='spaceMono'
            fontSize='sm'
            noOfLines={1}
          >
            Raid ID: {raid?.v1Id || raid?.id}
          </Text>
        </Link>
      </Stack>
    </Flex>
  );
};

export default ProjectInfo;
