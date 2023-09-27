import React from 'react';
import { Flex, HStack, Text, Divider } from '@raidguild/design-system';
import { format } from 'date-fns';

interface RaidUpdateProps {
  // id?: string;
  update: string;
  member: {
    name: string;
  };
  createdAt: string;
  // modifiedAt?: string;
}

const RaidUpdate: React.FC<RaidUpdateProps> = ({
  // id,
  update,
  member,
  createdAt,
}) => (
  <>
    <Flex
      direction='row'
      width='100%'
      alignItems='space-apart'
      justifyContent='space-between'
      marginY={2}
    >
      <Flex
        gap={4}
        direction={['column', null, null, null]}
        alignItems='flex-start'
        justifyContent='space-between'
        width='100%'
      >
        <Text
          color='white'
          as='p'
          fontSize='md'
          maxWidth={['95%', null, null, null]}
        >
          {update}
        </Text>
        <HStack spacing={1} color='gray.100'>
          <Text fontSize='smaller'>{member.name} @</Text>
          <Text fontSize='smaller'>
            {createdAt && format(new Date(createdAt), 'Pp')}
          </Text>
        </HStack>
      </Flex>
    </Flex>
    <Divider color='blackAlpha' size='sm' />
  </>
);

export default RaidUpdate;
