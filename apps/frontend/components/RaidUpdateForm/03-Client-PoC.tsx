/* eslint-disable dot-notation */
import {
  Button,
  defaultTheme,
  Heading,
  HStack,
  Select,
  Stack,
  Text,
  VStack,
} from '@raidguild/design-system';
import {
  useContacts,
  useUpsertConsultationsContacts,
} from '@raidguild/dm-hooks';
import { IContact, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useOverlay } from '../../contexts/OverlayContext';
import ContactUpdateForm from '../ContactUpdateForm';
import ModalWrapper from '../ModalWrapper';

interface ClientPocUpdateProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}

const ClientPoCUpdateForm: React.FC<ClientPocUpdateProps> = ({
  raidId,
  closeModal,
  raid,
}: ClientPocUpdateProps) => {
  const contactUpdateOverlay = useOverlay();

  const { setModals } = contactUpdateOverlay;

  const handleContactUpdateModal = () => {
    setModals({ contactUpdate: true, raidForm: true });
  };

  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { mutateAsync: upsertContacts } = useUpsertConsultationsContacts({
    token,
  });
  const { data, status } = useContacts({ token });
  const [sending, setSending] = useState(false);
  const contacts = data?.contacts as IContact[];

  const clientPoCs = raid['consultation'][
    'consultationsContacts'
  ] as unknown as IContact[];

  const defaultValues = _.map(
    clientPoCs,
    ({ contact }: { contact: IContact }) => ({
      label: `${contact?.name} - ${contact?.contactInfo?.email}`,
      value: contact?.id,
    })
  );

  const POC_DISPLAY_OPTIONS = _.map(contacts, (contact) => ({
    label: `${contact?.name} - ${contact?.contactInfo?.email ?? 'N/A'}`,
    value: contact.id,
  }));

  const onSubmit = (values) => {
    setSending(true);
    const updates = _.map(values.consultationsContacts, (contact) => ({
      contact_id: contact.value,
      consultation_id: raid.consultation.id,
    }));

    upsertContacts({ updates });
    closeModal();
    setSending(false);
  };

  const [editContact, setEditContact] = useState<IContact>(null);

  const localForm = useForm({
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting }, // will add errors in once we add validation
  } = localForm;

  const selectedPoCs = watch('consultationsContacts');

  return (
    <Stack>
      {status === 'success' && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label='Client PoCs'
            defaultValue={defaultValues as any[]}
            name='consultationsContacts'
            isSearchable
            isMulti
            options={POC_DISPLAY_OPTIONS}
            localForm={localForm}
          />

          <HStack justify='space-between' align='center' w='full' mt={8}>
            <Button
              w='full'
              variant='link'
              onClick={() => {
                setEditContact(null);

                setTimeout(() => {
                  handleContactUpdateModal();
                }, 100);
              }}
            >
              Create New Contact
            </Button>

            <Button isLoading={isSubmitting || sending} type='submit' w='100%'>
              Update Client PoCs
            </Button>
          </HStack>
        </form>
      )}

      <ModalWrapper
        name='contactUpdate'
        size='md'
        title={editContact ? 'Edit Contact' : 'Create New Contact'}
        localOverlay={contactUpdateOverlay}
        zIndex={200}
      >
        <ContactUpdateForm contact={editContact} />
      </ModalWrapper>

      {/* // display selected client PoCs */}

      <VStack overflowX='auto' maxH='500px' mt={6} w='full'>
        {_.compact(
          selectedPoCs?.map((contact, index) => {
            const foundContact: IContact = _.find(contacts, {
              id: contact.value,
            });
            return (
              foundContact && (
                <VStack
                  key={contact.value}
                  w='full'
                  p={8}
                  gap={4}
                  justifyContent='flex-start'
                  alignItems='flex-start'
                  backgroundColor={defaultTheme.colors.gray[900]}
                  textAlign='left'
                  border='1px solid #FFFFFF15'
                  borderRadius={12}
                >
                  <HStack justify='space-between' align='center' w='full'>
                    <Heading
                      as='h4'
                      fontSize='2xl'
                      textColor='white'
                      fontFamily='uncial'
                      variant='shadow'
                    >
                      Contact #{index + 1}
                    </Heading>
                    <Button
                      variant='solid'
                      onClick={() => {
                        setEditContact(foundContact);

                        // set delay
                        setTimeout(() => {
                          handleContactUpdateModal();
                        }, 100);
                      }}
                    >
                      Edit
                    </Button>
                  </HStack>
                  <HStack gap={6}>
                    <VStack
                      gap={1}
                      justifyContent='flex-start'
                      alignItems='flex-start'
                    >
                      <Text color='primary.500' fontFamily='texturina'>
                        Name:
                      </Text>
                      <Text>{foundContact?.name}</Text>
                    </VStack>
                    <VStack
                      gap={1}
                      justifyContent='flex-start'
                      alignItems='flex-start'
                    >
                      <Text color='primary.500' fontFamily='texturina'>
                        Email:
                      </Text>
                      <Text>{foundContact?.contactInfo?.email ?? 'N/A'}</Text>
                    </VStack>
                  </HStack>
                  <VStack
                    gap={1}
                    justifyContent='flex-start'
                    alignItems='flex-start'
                  >
                    <Text color='primary.500' fontFamily='texturina'>
                      Bio:
                    </Text>
                    <Text>{foundContact?.bio ?? 'N/A'}</Text>
                  </VStack>
                </VStack>
              )
            );
          })
        )}
      </VStack>
    </Stack>
  );
};

export default ClientPoCUpdateForm;
