import _ from 'lodash';
import {
  Flex,
  Heading,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  Button,
} from '@raidguild/design-system';
import { FiPlus } from 'react-icons/fi';
import { IRaid } from '../utils';

const tempTags = ['Help Needed', 'PM Wanted'];

type RaidTagsProps = {
  raid: Partial<IRaid>;
};

const RaidTags = ({ raid }: RaidTagsProps) => (
  <Flex direction="column" width="100%" marginTop={8}>
    <Heading size="md">Project Tags</Heading>
    <Box
      rounded="md"
      height="auto"
      width="100%"
      bg="gray.800"
      marginY={4}
      paddingX={4}
      paddingY={4}
    >
      {_.map(tempTags || _.get(raid, 'tags'), (tag: string) => (
        <Tag
          key={tag}
          borderRadius="full"
          size="md"
          variant="solid"
          colorScheme="blackAlpha"
          marginX={2}
        >
          <TagLabel padding={1} color="gray.100">
            {tag}
          </TagLabel>
          <TagCloseButton isDisabled />
        </Tag>
      ))}
    </Box>
    <VStack align="center" width="100%" marginTop={2}>
      <Button variant="outline" leftIcon={<FiPlus />} isDisabled>
        Add Tag
      </Button>
    </VStack>
  </Flex>
);

export default RaidTags;
