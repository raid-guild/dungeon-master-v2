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
}) => {
  return (
    <>
      <Flex
        direction="row"
        width="100%"
        alignItems="space-apart"
        justifyContent="space-between"
        marginY={2}
      >
        <HStack
          spacing={4}
          alignItems="flex-start"
          justifyContent="space-between"
          width="100%"
        >
          <Text color="white" as="p" fontSize="md" maxWidth="60%">
            {update}
          </Text>
          <HStack spacing={1} color="gray.100">
            <Text fontSize="smaller">{member.name} @</Text>
            <Text fontSize="smaller">
              {createdAt && format(new Date(createdAt), 'Pp')}
            </Text>
          </HStack>
        </HStack>
      </Flex>
      <Divider color="blackAlpha" size="sm" />
    </>
  );
};

export default RaidUpdate;
