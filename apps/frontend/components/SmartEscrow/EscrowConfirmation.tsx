import { Button, Flex, Stack, Text } from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import { commify } from '@raidguild/dm-utils';
import { useRegister } from '@raidguild/escrow-hooks';
import _ from 'lodash';
import { UseFormReturn } from 'react-hook-form';

import AccountLink from './shared/AccountLink';

const EscrowConfirmation = ({
  escrowForm,
  raid,
  updateStep,
  backStep,
}: {
  escrowForm: UseFormReturn;
  raid: IRaid;
  updateStep: () => void;
  backStep: () => void;
}) => {
  const { watch } = escrowForm;
  const { client, provider, token, total, milestones } = watch();

  const { writeAsync, isLoading } = useRegister({
    escrowForm,
  });

  const createInvoice = async () => {
    await writeAsync?.();

    // move to next step
    updateStep();
  };

  const invoiceDetails = [
    { label: 'Project Name', value: raid?.name },
    { label: 'Client Address', value: <AccountLink address={client} /> },
    { label: 'Raid Party Address', value: <AccountLink address={provider} /> },
    { label: 'Arbitration Provider', value: 'LexDAO' },
    { label: 'Payment Token', value: token },
    { label: 'Payment Due', value: commify(total) },
    { label: 'No of Payments', value: milestones },
  ];

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <Stack spacing={6}>
        <Stack>
          {_.map(invoiceDetails, ({ label, value }) => (
            <Flex justify='space-between' key={label}>
              <Text fontWeight='bold' variant='textOne'>
                {label}:
              </Text>
              {typeof value === 'string' ? (
                <Text variant='textOne' color='yellow.500'>
                  {value}
                </Text>
              ) : (
                value
              )}
            </Flex>
          ))}
        </Stack>

        <Flex direction='row' width='100%' justify='center'>
          <Button
            variant='outline'
            minW='25%'
            mr='.5rem'
            isDisabled={isLoading}
            onClick={backStep}
          >
            Back
          </Button>
          <Button
            variant='solid'
            w='100%'
            isDisabled={isLoading || !writeAsync}
            onClick={createInvoice}
          >
            {isLoading ? 'Creating Escrow..' : 'Create Escrow'}
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default EscrowConfirmation;
