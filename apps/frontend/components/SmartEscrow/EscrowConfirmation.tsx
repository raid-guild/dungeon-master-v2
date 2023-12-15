import {
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Tooltip,
} from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import { commify } from '@raidguild/dm-utils';
import { useEscrowZap, useRegister } from '@raidguild/escrow-hooks';
import { GANGGANG_MULTISIG } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Hex, zeroAddress } from 'viem';
import { WriteContractResult } from 'wagmi/dist/actions';

import AccountLink from './shared/AccountLink';

const EscrowConfirmation = ({
  escrowForm,
  raid,
  setTxHash,
  updateStep,
  backStep,
}: {
  escrowForm: UseFormReturn;
  raid: IRaid;
  setTxHash: Dispatch<SetStateAction<Hex | undefined>>;
  updateStep: () => void;
  backStep: () => void;
}) => {
  const { watch } = escrowForm;
  const {
    client,
    provider,
    token,
    milestones,
    ownersAndAllocations,
    threshold,
    projectName,
    projectDescription,
    projectAgreement,
    startDate,
    endDate,
    daoSplit,
    raidPartySplit,
    safetyValveDate,
  } = watch();

  const detailsData = useMemo(() => {
    if (raid) {
      return {
        projectName: raid?.id,
        projectDescription: '',
        projectAgreement: [],
        startDate: Math.floor(Date.now() / 1000),
        endDate: Math.floor(Date.now() / 1000),
      };
    }
    return {
      projectName,
      projectDescription,
      projectAgreement,
      startDate: Math.floor(Date.parse(startDate) / 1000),
      endDate: Math.floor(Date.parse(endDate) / 1000),
    };
  }, [
    raid,
    projectName,
    projectDescription,
    projectAgreement,
    startDate,
    endDate,
  ]);

  const canRegisterDirectly = !raidPartySplit && !daoSplit;

  const { writeAsync, isLoading: registerLoading } = useRegister({
    raidId: _.get(raid, 'id'),
    escrowForm,
    detailsData,
    enabled: canRegisterDirectly,
  });

  const { writeAsync: writeEscrowZap, isLoading: zapLoading } = useEscrowZap({
    ownersAndAllocations,
    threshold,
    milestones,
    token,
    provider: provider || zeroAddress,
    client,
    safetyValveDate,
    detailsData,
    projectTeamSplit: raidPartySplit,
    daoSplit,
    enabled: !canRegisterDirectly,
    onSuccess: (tx: WriteContractResult) => setTxHash(tx?.hash),
  });

  const createInvoice = async () => {
    if (canRegisterDirectly) {
      await writeAsync?.();
    } else {
      await writeEscrowZap?.();
    }

    // move to next step
    updateStep();
  };

  const total = _.sumBy(
    milestones,
    (milestone: { value: string }) => _.toNumber(milestone.value) || 0
  );

  const invoiceDetails = [
    { label: 'Project Name', value: raid?.name || projectName },
    {
      label: 'Client Address',
      value: (
        <AccountLink
          name={
            _.includes(_.values(GANGGANG_MULTISIG), client) &&
            'Ganggang Multisig'
          }
          address={client}
        />
      ),
    },
    {
      label: `Raid Party ${provider ? 'Multisig' : 'Address'}`,
      value: provider ? (
        <AccountLink address={provider} />
      ) : (
        <Tooltip
          label={`${_.size(ownersAndAllocations)} owners on the Safe and Split`}
          shouldWrapChildren
          placement='left'
          hasArrow
        >
          <Text>Split to be created</Text>
        </Tooltip>
      ),
    },
    daoSplit && { label: 'DAO Split for Spoils', value: '10%' },
    { label: 'Full Escrow Amount', value: `${commify(total)} ${token}` },
    { label: 'No of Payments', value: _.size(milestones) },
    {
      label: 'Arbitration Provider',
      value: daoSplit ? (
        'LexDAO'
      ) : (
        <Tooltip
          label='No DAO split'
          shouldWrapChildren
          placement='left'
          hasArrow
        >
          <Text>Raid Guild DAO</Text>
        </Tooltip>
      ),
    },
    startDate &&
      endDate && {
        label: 'Project Dates',
        value: `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
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
    </Card>
  );
};

export default EscrowConfirmation;
