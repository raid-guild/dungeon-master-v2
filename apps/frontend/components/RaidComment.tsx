import React from 'react';
import { Flex, HStack, Text, Divider } from '@raidguild/design-system';
import { format } from 'date-fns';

interface RaidCommentProps {
  // id?: string;
  comment: string;
  commentedBy: {
    name: string;
  };
  // commentedRaid?: string;
  createdAt: string;
  // modifiedAt?: string;
}

const RaidComment: React.FC<RaidCommentProps> = ({
  // id,
  comment,
  commentedBy,
  // commentedRaid = 'Dungeon Master v1',
  createdAt,
}: // modifiedAt,
RaidCommentProps) => {
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
            {comment}
          </Text>
          <HStack spacing={1} color="gray.100">
            <Text fontSize="smaller">{commentedBy.name} @</Text>
            <Text fontSize="smaller">
              {createdAt && format(new Date(+createdAt), 'Pp')}
            </Text>
          </HStack>
        </HStack>
      </Flex>
      <Divider color="blackAlpha" size="sm" />
    </>
  );
};

export default RaidComment;
