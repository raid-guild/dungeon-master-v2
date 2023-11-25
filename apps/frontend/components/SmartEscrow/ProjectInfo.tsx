// import { FlexDirection, ResponsiveValue } from '@chakra-ui/react';
import { Flex, Heading, Stack, Text } from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';

const ProjectInfo = ({
  raid,
  direction,
}: {
  raid: IRaid;
  direction?: any; // ResponsiveValue<FlexDirection>;
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
      minW='400px'
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

        <Text color='gray.400' fontFamily='texturina'>
          Raid ID: {raid?.v1Id || raid?.id}
        </Text>
      </Stack>
    </Flex>
  );
};

export default ProjectInfo;
