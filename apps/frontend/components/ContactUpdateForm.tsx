import { Button, Input, Stack } from '@raidguild/design-system';
import { useContactCreate, useContactUpdate } from '@raidguild/dm-hooks';
import { IContact } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const contactOptions = ['email', 'discord', 'github', 'twitter', 'telegram'];

const ContactUpdateForm = ({ contact }: { contact?: IContact }) => {
  const [sending, setSending] = useState(false);

  const contactInfos = _.map(contactOptions, (option) => ({
    label: option,
    value: contact ? _.get(contact?.contactInfo, `${option}`) : '',
  }));

  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { mutateAsync: updateContact } = useContactUpdate({ token });
  const { mutateAsync: createContact } = useContactCreate({ token }); // Create contact hook

  const localForm = useForm({
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = localForm;

  const onSubmit = async (values) => {
    setSending(true);

    const contactData = {
      id: contact?.id,
      name: values['Contact name'],
      bio: values.Bio,
      eth_address: values.ethAddress,
    };

    const contactInfoData = _.pick(values, contactOptions);

    if (contact) {
      // Update existing contact
      await updateContact({
        contactData,
        contactInfoData,
        contactInfoId: contact?.contactInfo.id,
      });
    } else {
      // Create new contact
      await createContact({
        contactData,
        contactInfoData,
      });
    }

    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} gap={4} p={4}>
        <Input
          name='Contact name'
          defaultValue={contact?.name ?? ''}
          aria-label='Contact Name'
          placeholder='Contact Name'
          rounded='base'
          label='Member Name'
          localForm={localForm}
        />
        <Input
          name='Bio'
          defaultValue={contact?.bio ?? ''}
          aria-label='Bio'
          placeholder='Bio'
          rounded='base'
          label='Bio'
          localForm={localForm}
        />
        <Input
          name='ethAddress'
          defaultValue={contact?.ethAddress ?? ''}
          aria-label='Ethereum Address'
          placeholder='Ethereum Address'
          rounded='base'
          label='Ethereum Address'
          localForm={localForm}
        />

        {_.map(contactInfos, ({ label, value }) => (
          <Input
            key={label}
            name={label}
            defaultValue={value ?? ''}
            aria-label={label}
            placeholder={label}
            rounded='base'
            label={label.charAt(0).toUpperCase() + label.slice(1)}
            localForm={localForm}
          />
        ))}

        <Button isLoading={isSubmitting || sending} type='submit'>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default ContactUpdateForm;
