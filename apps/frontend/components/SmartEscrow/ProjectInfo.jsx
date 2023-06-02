import { Flex, Heading, Box, Link, Text } from '@chakra-ui/react';

export const ProjectInfo = ({ context }) => {
  return (
    <Flex direction='column' alignItems='flex-start'>
      <Heading size='sm' fontFamily='jetbrains' color='red'>
        {context.client_name}
      </Heading>

      <Heading size='md' fontFamily='spaceMono' color='white' maxWidth='300px'>
        {context.project_name}
      </Heading>

      <Box marginTop='15px' marginBottom='.7rem' fontFamily='jetbrains'>
        <Text color='#a7a9be'>Raid ID: {context.v1_id || context.raid_id}</Text>
      </Box>

      {/* {context.link_to_details === 'Not Specified' && (
        <Text color='purpleLight' fontFamily='jetbrains'>
          Project specs not specified.
        </Text>
      )} */}

      {/* {context.link_to_details !== 'Not Specified' && (
        <Link
          href={context.link_to_details}
          target='_blank'
          rel='noopener noreferrer'
          color={`${theme.colors.purpleLight}`}
          textDecoration='underline'
          fontFamily='jetbrains'
          marginBottom='.5rem'
        >
          Link to project doc provided
        </Link>
      )} */}
    </Flex>
  );
};
