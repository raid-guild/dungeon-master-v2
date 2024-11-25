import { Divider, Flex, HStack, Text } from '@raidguild/design-system';
import { format } from 'date-fns';
import React from 'react';

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
}: RaidUpdateProps) => (
  <>
    <Flex
      direction='row'
      width='100%'
      alignItems='space-between' /* Changed 'space-apart' to 'space-between' */
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
          <Text fontSize='sm'>{member.name} @</Text>{' '}
          {/* Changed 'smaller' to 'sm' */}
          <Text fontSize='sm'>
            {createdAt && format(new Date(createdAt), 'Pp')}
          </Text>
        </HStack>
      </Flex>
    </Flex>
    <Divider color='blackAlpha' size='sm' />
  </>
);

export default RaidUpdate;
