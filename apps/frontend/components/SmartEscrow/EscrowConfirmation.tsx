import { Button, Card, Flex, Stack, Text } from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import { commify } from '@raidguild/dm-utils';
import { useEscrowZap, useRegister } from '@raidguild/escrow-hooks';
import _ from 'lodash';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { decodeAbiParameters, Hex } from 'viem';
import { useWaitForTransaction } from 'wagmi';

import AccountLink from './shared/AccountLink';
import ZapAddresses from './ZapAddresses';

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
  const [hash, setHash] = useState<Hex>();
  const { watch } = escrowForm;
  const {
    client,
    provider,
    token,
    milestones,
    ownersAndAllocations,
    threshold,
    daoSplit,
    raidPartySplit,
    safetyValveDate,
  } = watch();

  const canRegisterDirectly = !raidPartySplit && !daoSplit;
  const details = 'ipfs://Qmtest';

  const { writeAsync, isLoading: registerLoading } = useRegister({
    raidId: _.get(raid, 'id'),
    escrowForm,
    details,
    enabled: canRegisterDirectly,
  });

  const { writeAsync: writeEscrowZap, isLoading: zapLoading } = useEscrowZap({
    ownersAndAllocations,
    threshold,
    milestones,
    token,
    provider,
    client,
    safetyValveDate,
    details,
    projectTeamSplit: raidPartySplit,
    daoSplit,
    enabled: !canRegisterDirectly,
  });
  console.log('writeAsync', writeAsync);

  const { data: txData } = useWaitForTransaction({
    hash,
  });
  let addresses: Hex[];
  if (txData?.logs?.[6]?.data) {
    addresses = decodeAbiParameters(
      ['address', 'address', 'address', 'address'],
      txData?.logs?.[6]?.data
    ) as Hex[];
  }

  const createInvoice = async () => {
    if (canRegisterDirectly) {
      await writeAsync?.();
    } else {
      const result = await writeEscrowZap?.();
      setHash(result?.hash);
    }

    // move to next step
    updateStep();
  };

  const total = _.sumBy(
    milestones,
    (milestone: { value: string }) => _.toNumber(milestone.value) || 0
  );

  const invoiceDetails = [
    raid && { label: 'Project Name', value: raid?.name },
    { label: 'Client Address', value: <AccountLink address={client} /> },
    {
      label: 'Raid Party Address',
      value: provider ? (
        <AccountLink address={provider} />
      ) : (
        <Text>Split to be created</Text>
      ),
    },
    daoSplit && { label: 'DAO Split', value: '10%' },
    { label: 'Full Escrow Amount', value: `${commify(total)} ${token}` },
    { label: 'No of Payments', value: _.size(milestones) },
    {
      label: 'Arbitration Provider',
      value: daoSplit ? 'LexDAO' : 'Raid Guild',
    },
    {
      label: 'Safety Valve Date',
      value: safetyValveDate?.toLocaleDateString(),
    },
  ];

  return (
    <Card as={Flex} variant='filled' direction='column' minWidth='50%'>
      <Stack spacing={6} w='100%'>
        <Stack>
          {_.map(_.compact(invoiceDetails), ({ label, value }) => (
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
            isDisabled={zapLoading || registerLoading}
            onClick={backStep}
          >
            Back
          </Button>
          <Button
            variant='solid'
            w='100%'
            isDisabled={
              registerLoading || zapLoading || !(writeAsync || writeEscrowZap)
            }
            isLoading={registerLoading || zapLoading}
            onClick={createInvoice}
          >
            Create Escrow
          </Button>
        </Flex>
      </Stack>
      <ZapAddresses addresses={addresses} />
    </Card>
  );
};

export default EscrowConfirmation;
