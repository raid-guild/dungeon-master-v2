import { Button, Input, Stack } from '@raidguild/design-system';
import { useRaidUpdate } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AdditionalInfoUpdateProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
}

const AdditionalInfoUpdateForm: React.FC<AdditionalInfoUpdateProps> = ({
  raidId,
  closeModal,
  raid,
}: AdditionalInfoUpdateProps) => {
  const { escrowIndex, lockerHash, invoiceAddress, id } = raid;

  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { mutateAsync: updateAdditionalRaidDetails } = useRaidUpdate({
    token,
    raidId: id,
  });

  const [sending, setSending] = useState(false);

  const localForm = useForm({
    mode: 'all',
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = localForm;

  function onSubmit(values) {
    setSending(true);
    updateAdditionalRaidDetails({
      raid_updates: {
        escrow_index: values.escrowIndex ?? escrowIndex,
        locker_hash: values.lockerHash ?? lockerHash,
        invoice_address: values.invoiceAddress ?? invoiceAddress,
      },
    });
    closeModal();
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Input
          name='raidId'
          defaultValue={id}
          aria-label='raidId'
          placeholder='raidId'
          rounded='base'
          label='Raid ID'
          localForm={localForm}
          isDisabled
        />
        <Input
          name='escrowIndex'
          defaultValue={escrowIndex ?? ''}
          aria-label='escrowIndex'
          placeholder='escrowIndex'
          rounded='base'
          label='Escrow Index'
          localForm={localForm}
        />
        <Input
          name='lockerHash'
          defaultValue={lockerHash ?? ''}
          aria-label='lockerHash'
          placeholder='lockerHash'
          rounded='base'
          label='Locker Hash'
          localForm={localForm}
        />
        <Input
          name='invoiceAddress'
          defaultValue={invoiceAddress ?? ''}
          aria-label='invoiceAddress'
          placeholder='invoiceAddress'
          rounded='base'
          label='Invoice Address'
          localForm={localForm}
        />

        <Button
          isLoading={isSubmitting || sending}
          type='submit'
          width='full'
          color='raid'
          borderColor='raid'
          border='1px solid'
          size='md'
          textTransform='uppercase'
          fontSize='sm'
          fontWeight='bold'
        >
          Update Additional Details
        </Button>
      </Stack>
    </form>
  );
};

export default AdditionalInfoUpdateForm;
