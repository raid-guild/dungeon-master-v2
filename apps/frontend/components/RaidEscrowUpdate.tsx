import { Flex, Text, HStack, Divider } from '@raidguild/design-system';
import format from 'date-fns/format';
import { IEscrowEvent } from '@raidguild/dm-types';

export const RaidEscrowUpdate = (props: IEscrowEvent) => {
  const {
    createdAt,
    type,
    milestone,
    amount,
    sender,
    txHash,
    totalMileStones,
  } = props;

  return (
    <>
      <Flex
        direction='row'
        width='100%'
        alignItems='space-between'
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
            {type === 'release'
              ? `$${amount} released for milestone ${
                  Number(milestone) + 1 + '/' + totalMileStones
                }`
              : `$${amount} deposited to invoice`}
          </Text>
          <HStack spacing={1} color='gray.100'>
            <Text fontSize='sm'>
              Updated by Smart Invoice @
              {createdAt && format(new Date(createdAt), 'Pp')}
            </Text>
          </HStack>
        </Flex>
      </Flex>
      <Divider color='blackAlpha' size='sm' />
    </>
  );
};
