import {
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import { chainsMap, commify } from '@raidguild/dm-utils';
import {
  GANGGANG_MULTISIG,
  INVOICE_VERSION,
  NETWORK_CONFIG,
  updateRaidInvoice,
} from '@raidguild/escrow-utils';
import {
  useDetailsPin,
  useEscrowZap,
  useInvoiceCreate,
} from '@smartinvoicexyz/hooks';
import { FormInvoice, InvoiceMetadata } from '@smartinvoicexyz/types';
import { WriteContractReturnType } from '@wagmi/core';
import _ from 'lodash';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Hex, zeroAddress } from 'viem';
import { useChainId } from 'wagmi';

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
  const toast = useToast();
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
  const chainId = useChainId();

  const detailsData = useMemo<InvoiceMetadata>(() => {
    const now = Math.floor(Date.now() / 1000);
    if (raid) {
      return {
        version: INVOICE_VERSION,
        id: _.join([raid?.id, now, INVOICE_VERSION], '-'),
        title: raid?.id,
        description: '',
        documents: [],
        startDate: now,
        endDate: now,
        createdAt: now,
        milestones: [],
      };
    }
    return {
      version: INVOICE_VERSION,
      id: _.join([projectName, Date.now() / 1000, INVOICE_VERSION], '-'),
      title: projectName,
      description: projectDescription,
      milestones: [],
      documents: projectAgreement,
      startDate: Math.floor(Date.parse(startDate) / 1000),
      endDate: Math.floor(Date.parse(endDate) / 1000),
      createdAt: Math.floor(Date.now() / 1000),
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

  const { data: details, isLoading: detailsLoading } = useDetailsPin({
    ...detailsData,
  });

  const onRegisterSuccess = async (smartInvoiceId: Hex) => {
    const raidId = _.get(raid, 'id');
    await updateRaidInvoice(chainId, raidId, smartInvoiceId);
  };
  const { writeAsync, isLoading: registerLoading } = useInvoiceCreate({
    toast,
    invoiceForm: escrowForm as UseFormReturn<Partial<FormInvoice>>,
    details,
    enabled: canRegisterDirectly,
    onTxSuccess: (smartInvoiceId) => onRegisterSuccess(smartInvoiceId),
    networkConfig: {
      resolver: _.first(
        _.keys(_.get(NETWORK_CONFIG[chainId], 'RESOLVERS'))
      ) as Hex,
      token: _.get(NETWORK_CONFIG[chainId], `TOKENS.${token}.address`),
      tokenDecimals: _.get(NETWORK_CONFIG[chainId], `TOKENS.${token}.decimals`),
    },
  });

  const { writeAsync: writeEscrowZap, isLoading: zapLoading } = useEscrowZap({
    ownersAndAllocations,
    threshold,
    milestones,
    token,
    provider: provider || zeroAddress,
    client,
    safetyValveDate,
    details,
    projectTeamSplit: raidPartySplit,
    daoSplit,
    networkConfig: {
      tokenAddress: _.get(NETWORK_CONFIG[chainId], `TOKENS.${token}.address`),
      tokenDecimals: _.get(NETWORK_CONFIG[chainId], `TOKENS.${token}.decimals`),
      zapAddress: _.get(NETWORK_CONFIG[chainId], 'ZAP_ADDRESS'),
      resolver: _.first(
        _.keys(_.get(NETWORK_CONFIG[chainId], 'RESOLVERS'))
      ) as Hex,
      daoAddress: _.get(NETWORK_CONFIG[chainId], 'DAO_ADDRESS'),
    },
    enabled: !canRegisterDirectly,
    onSuccess: (tx: WriteContractReturnType) => setTxHash(tx),
  });

  const createInvoice = async () => {
    if (canRegisterDirectly) {
      await writeAsync?.();
      // move to next step
      updateStep();
    } else {
      try {
        await writeEscrowZap?.();
        // move to next step
        updateStep();
      } catch (error) {
        if (error?.message?.match(/User rejected/)) {
          /* eslint-disable no-console */
          console.error('Transaction rejected by user', error);
          toast.error({
            title: 'Transaction Rejected',
            description: 'Transaction was rejected. Please try again.',
          });
        } else {
          /* eslint-disable no-console */
          console.error('Transaction failed:', error);
          toast.error({
            title: 'Transaction Failed',
            description: error.message,
          });
        }
      }
    }
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
          chainId={chainId}
        />
      ),
    },
    {
      label: `Raid Party ${provider ? 'Multisig' : 'Address'}`,
      value: provider ? (
        <AccountLink address={provider} chainId={chainId} />
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
        Object.keys(NETWORK_CONFIG[chainId].RESOLVERS).map(
          (key) => NETWORK_CONFIG[chainId].RESOLVERS[key]?.name
        )[0]
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
          <Flex justify='space-between'>
            <Text fontWeight='bold' variant='textOne'>
              Chain
            </Text>
            <Text variant='textOne' color='yellow.500'>
              {chainsMap(chainId)?.name}
            </Text>
          </Flex>
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
            isDisabled={zapLoading || registerLoading || detailsLoading}
            onClick={backStep}
          >
            Back
          </Button>
          <Button
            variant='solid'
            w='100%'
            isDisabled={
              registerLoading ||
              zapLoading ||
              detailsLoading ||
              !(writeAsync || writeEscrowZap)
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
