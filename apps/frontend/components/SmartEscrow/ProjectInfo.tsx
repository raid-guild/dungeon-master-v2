import { Flex, Heading, Box, Text } from '@raidguild/design-system';

export const ProjectInfo = ({ appState }) => {
  return (
    <Flex direction='column' alignItems='flex-start'>
      <Heading size='sm' fontFamily='texturina' color='primary.300'>
        {appState.client_name}
      </Heading>

      <Heading size='md' fontFamily='spaceMono' color='white' maxWidth='300px'>
        {appState.project_name}
      </Heading>

      <Box marginTop='15px' marginBottom='.7rem' fontFamily='texturina'>
        <Text color='#a7a9be'>
          Raid ID: {appState.v1_id || appState.raid_id}
        </Text>
      </Box>
    </Flex>
  );
};
