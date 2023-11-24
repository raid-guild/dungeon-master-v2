import { Flex, HStack, Stack, Text, Tooltip } from '@raidguild/design-system';
import { Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useMemo } from 'react';

import { QuestionIcon } from './icons/QuestionIcon';
import AccountLink from './shared/AccountLink';

const InvoiceMetaDetails = ({ invoice }: { invoice: Invoice }) => {
  const dataValues = useMemo(
    () => [
      { label: 'Client', value: invoice.client },
      { label: 'Raid Party', value: invoice.provider },
      { label: 'Resolver', value: invoice.resolver },
    ],
    [invoice.client, invoice.provider, invoice.resolver]
  );

  return (
    <Stack mt='2rem'>
      <Flex justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='texturina'>
          Safety Valve Date:
        </Text>
        <HStack>
          <Text>{new Date(invoice.terminationTime * 1000).toDateString()}</Text>
          <Tooltip
            label='The funds can be withdrawn by the client after 00:00:00 GMT on this date'
            placement='auto-start'
          >
            <QuestionIcon boxSize='0.85rem' />
          </Tooltip>
        </HStack>
      </Flex>

      {_.map(dataValues, (dataValue) => (
        <Flex justifyContent='space-between' fontSize='sm'>
          <Text fontWeight='bold' fontFamily='texturina'>
            {dataValue.label}
          </Text>
          <AccountLink address={dataValue.value} />
        </Flex>
      ))}
    </Stack>
  );
};

export default InvoiceMetaDetails;
