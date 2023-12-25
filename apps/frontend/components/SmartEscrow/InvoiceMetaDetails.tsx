import { useSplitMetadata } from '@0xsplits/splits-sdk-react';
import { Flex, HStack, Stack, Text, Tooltip } from '@raidguild/design-system';
import { getResolverInfo, Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';

import { QuestionIcon } from './icons/QuestionIcon';
import AccountLink from './shared/AccountLink';

const InvoiceMetaDetails = ({ invoice }: { invoice: Invoice }) => {
  const chainId = useChainId();

  const { splitMetadata } = useSplitMetadata(invoice?.providerReceiver);
  const resolverInfo = getResolverInfo(chainId, invoice.resolver);

  const dataValues = useMemo(
    () => [
      { label: 'Client', value: invoice.client },
      {
        label: 'Raid Party',
        value: invoice.providerReceiver || invoice.provider,
        isSplit: !!splitMetadata,
      },
      { label: 'Resolver', name: resolverInfo?.name, value: invoice.resolver },
    ],
    [
      invoice.client,
      invoice.provider,
      invoice.providerReceiver,
      invoice.resolver,
      splitMetadata,
      resolverInfo?.name,
    ]
  );

  return (
    <Stack mt='2rem' w='100%'>
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
        <Flex
          justifyContent='space-between'
          fontSize='sm'
          key={dataValue.label}
        >
          <Text fontWeight='bold' fontFamily='texturina'>
            {dataValue.label}
          </Text>
          <AccountLink
            name={dataValue.name}
            address={dataValue.value}
            isSplit={dataValue.isSplit}
          />
        </Flex>
      ))}
    </Stack>
  );
};

export default InvoiceMetaDetails;
