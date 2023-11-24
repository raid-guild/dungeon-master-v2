import { HStack, Text, Tooltip } from '@raidguild/design-system';
import { Invoice } from '@raidguild/escrow-utils';

import { QuestionIcon } from './icons/QuestionIcon';
import { AccountLink } from './shared/AccountLink';

// TODO use array

const InvoiceMetaDetails = ({ invoice }: { invoice: Invoice }) => (
  <>
    <HStack mb='.5rem' mt='2rem' justifyContent='space-between' fontSize='sm'>
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
    </HStack>
    <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
      <Text fontWeight='bold' fontFamily='texturina'>
        Client:
      </Text>
      <AccountLink address={invoice.client} />
    </HStack>
    <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
      <Text fontWeight='bold' fontFamily='texturina'>
        Raid Party:
      </Text>
      <AccountLink address={invoice.provider} />
    </HStack>
    <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
      <Text fontWeight='bold' fontFamily='texturina'>
        Resolver:
      </Text>
      <AccountLink address={invoice.resolver} />
    </HStack>
  </>
);

export default InvoiceMetaDetails;
