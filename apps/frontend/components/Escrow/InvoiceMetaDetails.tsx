import {
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  Tooltip,
} from '@raidguild/design-system';
import {
  chainIdToIconMap,
  chainsMap,
  networkToIdMap,
} from '@raidguild/dm-utils';
import { getResolverInfo, Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';

import { QuestionIcon } from './icons/QuestionIcon';
import AccountLink from './shared/AccountLink';

const InvoiceMetaDetails = ({
  invoice,
  receiverIsSplit,
}: {
  invoice: Invoice;
  receiverIsSplit: boolean;
}) => {
  const chainId = useChainId();

  const resolverInfo = getResolverInfo(chainId, invoice.resolver);

  const dataValues = useMemo(
    () =>
      _.compact([
        { label: 'Client', value: invoice.client },
        { label: 'Provider', value: invoice.provider },
        invoice.providerReceiver && {
          label: 'Raid Party (Receiver)',
          value: invoice.providerReceiver,
          isSplit: receiverIsSplit,
        },
        {
          label: 'Resolver',
          name: resolverInfo?.name,
          value: invoice.resolver,
        },
      ]),
    [
      invoice.client,
      invoice.provider,
      invoice.providerReceiver,
      invoice.resolver,
      resolverInfo?.name,
      receiverIsSplit,
    ]
  );

  return (
    <Stack mt='2rem' w='100%'>
      <Flex justifyContent='space-between' fontSize='sm'>
        <Text fontFamily='texturina' fontWeight='bold'>
          Chain:
        </Text>
        <HStack>
          <Text>{chainsMap(networkToIdMap(invoice.network)).name}</Text>
          <Image
            alt={invoice.network}
            boxSize='18px'
            src={chainIdToIconMap(networkToIdMap(invoice.network))}
          />
        </HStack>
      </Flex>
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
            chainId={chainId}
          />
        </Flex>
      ))}
    </Stack>
  );
};

export default InvoiceMetaDetails;
