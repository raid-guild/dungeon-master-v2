import { Button, Flex, HStack, Text } from '@raidguild/design-system';
import { useRegister } from '@raidguild/escrow-hooks';
import { UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';

import { AccountLink } from './shared/AccountLink';

const EscrowConfirmation = ({
  escrowForm,
  updateStep,
  backStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: () => void;
  backStep: () => void;
}) => {
  const { watch } = escrowForm;
  const {
    client,
    serviceProvider,
    tokenType,
    paymentDue,
    milestones,
    payments,
    selectedDay,
    projectName,
  } = watch();

  const chainId = useChainId();

  const createInvoice = async () => {};

  const { writeAsync, isLoading } = useRegister({
    escrowForm,
  });

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Project Name:
        </Text>
        <Text variant='textOne' color='white' maxWidth='200px' isTruncated>
          {projectName}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Client Address:
        </Text>
        <AccountLink address={client} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Raid Party Address:
        </Text>
        <AccountLink address={serviceProvider} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Arbitration Provider:
        </Text>
        <Text variant='textOne' color='white'>
          LexDAO
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Payment Token:
        </Text>
        <Text variant='textOne' color='yellow.500'>
          {tokenType}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Payment Due:
        </Text>
        <Text variant='textOne' color='yellow.500'>
          {paymentDue}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          No of Payments:
        </Text>
        <Text variant='textOne' color='yellow.500'>
          {milestones}
        </Text>
      </HStack>

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
          isDisabled={isLoading}
          onClick={createInvoice}
        >
          {isLoading ? 'Creating Escrow..' : 'Create Escrow'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default EscrowConfirmation;
