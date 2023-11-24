import { Flex, Heading, Stack, Text } from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';

const ProjectInfo = ({ raid }: { raid: IRaid }) => {
  const clientName = _.get(
    raid,
    'consultation.consultationsContacts[0].contact.name'
  );

  return (
    <Flex justify='space-between' align='center'>
      <Heading size='md' fontFamily='spaceMono' color='white' maxWidth='400px'>
        {raid?.name}
      </Heading>

      <Stack align='flex-end' spacing={1}>
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
