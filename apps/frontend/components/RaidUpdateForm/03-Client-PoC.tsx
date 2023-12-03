/* eslint-disable dot-notation */
import { Box, Button, Card, defaultTheme,FormControl, FormLabel, Heading, HStack, Select, Spacer, Text, VStack } from "@raidguild/design-system";
import { useContacts } from "@raidguild/dm-hooks";
import { IRaid } from "@raidguild/dm-types";
import { useOverlay } from "apps/frontend/contexts/OverlayContext";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ModalWrapper from "../ModalWrapper";

interface ClientPocUpdateProps {
    raidId?: string;
    closeModal?: () => void;
    raid: Partial<IRaid>;
    // consultation:  Partial<IConsultation>;
  }


interface IContact {
    id: string;
    name: string;
    bio: string | null;
    contactInfo: { email: string };
  }
  


const ClientPoCUpdateForm: React.FC<ClientPocUpdateProps> = ({
    raidId,
    closeModal,
    raid,
  }: ClientPocUpdateProps) =>{

    const contactUpdateOverlay = useOverlay();

    const { data: session } = useSession();
    const token = _.get(session, "token");
    const {data, status} = useContacts({token});
    const [sending, setSending] = useState(false);
    const contacts = data?.contacts as IContact[];


    const clientPoCs = raid['consultation']['consultationsContacts'] as IContact[];


    const defaultValues =  _.map(clientPoCs as IContact[], ({contact}: {contact: IContact}) => ({
      label: `${contact?.name} - ${contact?.contactInfo?.email}`,
      value: contact?.id,
    }));


    console.log(defaultValues, clientPoCs[0]);

  const POC_DISPLAY_OPTIONS = _.map(contacts as IContact[], (contact) => ({
    label: `${contact?.name} - ${contact?.contactInfo?.email}`,
    value: contact.id,
  }));


    const onSubmit = (data) => {
        setSending(true);
        console.log(data);
      };
    

      

    const localform = useForm({
        mode: "all",
      });
      
      const {
        handleSubmit,
        getValues,
        setValue,
        control,
        watch,
        formState: { isSubmitting }, // will add errors in once we add validation
      } = localform;

      const selectedPoCs = watch('consultationContacts');


    return (
    <Box>

<ModalWrapper name="updateContact" size="md" title="Update Member" localOverlay={contactUpdateOverlay} >
  <ContactUpdateForm closeModal={contactUpdateOverlay.closeModals} />
</ModalWrapper>

        {status === 'success' && <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel color="raid">Client PoCs</FormLabel>
          <Controller
            name="consultationContacts"
            defaultValue={defaultValues}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {
                  ...field
                }
                isSearchable
                isMulti
                name="consultationContacts"
                options={POC_DISPLAY_OPTIONS}
                localForm={localform}
              />
            )}
          />

        </FormControl>
        <Button
          isLoading={isSubmitting || sending}
          type="submit"
          width="full"
          color="raid"
          borderColor="raid"
          border="1px solid"
          size="md"
          textTransform="uppercase"
          fontSize="sm"
          fontWeight="bold"
        >
          Update Client PoCs
        </Button>

        </form>}

                {/* // display selected client PoCs */}
                
                <VStack overflowX='auto' maxH="500px" mt={6} w='fit-content'>
                  {
                    _.compact(selectedPoCs?.map((contact, index) => {
                      const foundContact = _.find(contacts, { id: contact.value });
                      return foundContact && (
                        <VStack key={contact.value} w='full' p={8} gap={4} justifyContent="flex-start" alignItems='flex-start' backgroundColor={defaultTheme.colors.gray[900]} textAlign="left" border="1px solid #FFFFFF15" borderRadius={12}>
                          <HStack justify="space-between" align="center" w="full"> 
                          <Heading as="h4" fontSize="2xl" textColor="white" fontFamily="uncial" variant="shadow" >
                            Contact #{index + 1}
                          </Heading>
                          <Button>Edit</Button>
                          
                          </HStack>
                          <HStack gap={6}>
                          <VStack gap={1} justifyContent="flex-start" alignItems='flex-start'>
                            <Text color="primary.500" fontFamily="texturina">Name:</Text>
                            <Text>{foundContact.name}</Text>
                          </VStack>
                          <VStack gap={1} justifyContent="flex-start" alignItems='flex-start'>
                            <Text color="primary.500" fontFamily="texturina">Email:</Text>
                            <Text>{foundContact.contactInfo.email ?? 'N/A'}</Text>
                          </VStack>
                          </HStack>
                          <VStack gap={1} justifyContent="flex-start" alignItems='flex-start'>
                            <Text color="primary.500" fontFamily="texturina">Bio:</Text>
                            <Text>{foundContact.bio ?? 'N/A'}</Text>
                          </VStack>
                        </VStack>
                      );
                    }))
                    
                  }

          </VStack>

    </Box>)}
  


export default ClientPoCUpdateForm;