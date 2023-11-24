import { Box, Flex, Heading, Text } from '@raidguild/design-system';
import { Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';

const ProjectInfo = ({ invoice }: { invoice: Partial<Invoice> }) => {
  const { clientName, projectName, raidId } = _.pick(invoice, [
    'clientName',
    'projectName',
    'raidId',
  ]);

  return (
    <Flex direction='column' alignItems='flex-start'>
      <Heading size='sm' fontFamily='texturina' color='primary.300'>
        {clientName}
      </Heading>

      <Heading size='md' fontFamily='spaceMono' color='white' maxWidth='300px'>
        {projectName}
      </Heading>

      <Box marginTop='15px' marginBottom='.7rem' fontFamily='texturina'>
        <Text color='#a7a9be'>Raid ID: {raidId}</Text>
      </Box>
    </Flex>
  );
};

export default ProjectInfo;
