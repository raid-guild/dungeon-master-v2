import _ from 'lodash';
import {
  Flex,
  Heading,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
  Button,
  Icon,
} from '@raidguild/design-system';
import { FiPlus } from 'react-icons/fi';
import { IRaid } from '@raidguild/dm-utils';

const tempTags = ['Help Needed', 'PM Wanted'];

type RaidTagsProps = {
  raid: Partial<IRaid>;
};

const RaidTags = ({ raid }: RaidTagsProps) => (
  <Flex direction='column' width='100%' marginTop={8}>
    <Stack>
      <Heading size='md'>Project Tags</Heading>
      <Box
        rounded='md'
        height='auto'
        width='100%'
        bg='gray.800'
        marginY={4}
        paddingX={4}
        paddingY={4}
      >
        {_.map(tempTags || _.get(raid, 'tags'), (tag: string) => (
          <Tag
            key={tag}
            borderRadius='full'
            size='md'
            variant='solid'
            colorScheme='gray'
            marginX={2}
          >
            <TagLabel padding={1} color='blackAlpha.800'>
              {tag}
            </TagLabel>
            <TagCloseButton color='blackAlpha.800' isDisabled />
          </Tag>
        ))}
      </Box>

      <Flex justify='center'>
        <Button
          variant='link'
          leftIcon={<Icon as={FiPlus} color='primary.500' />}
          isDisabled
        >
          Add Tag
        </Button>
      </Flex>
    </Stack>
  </Flex>
);

export default RaidTags;
