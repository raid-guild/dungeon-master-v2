/* eslint-disable dot-notation */
import { Box, FormControl, FormLabel, Select, Text } from "@raidguild/design-system";
import { useContacts } from "@raidguild/dm-hooks";
import { IRaid } from "@raidguild/dm-types";
import { BUDGET_DISPLAY_OPTIONS } from "@raidguild/dm-utils";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";

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

    const { data: session } = useSession();
    const token = _.get(session, "token");
    const {data} = useContacts({token});

    const {contacts} = data as {contacts: IContact[]};

    const clientPoCs = raid['consultation']['consultationsContacts'];


  const POC_DISPLAY_OPTIONS = _.map(contacts as IContact[], (contact) => ({
    label: `${contact?.name} - ${contact?.contactInfo?.email}`,
    value: contact.id,
  }));


    const onSubmit = (data) => {
        console.log(data);
      };
    

      

    const localform = useForm({
        mode: "all",
      });
      
      const {
        handleSubmit,
        setValue,
        control,
        formState: { isSubmitting }, // will add errors in once we add validation
      } = localform;

    return (
    <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel color="raid">Client PoCs</FormLabel>
          <Controller
            name="consultationContacts"
            defaultValue={clientPoCs[0]}
            control={control}
            render={({ field }) => (
              <Select
                // eslint-disable-next-line react/jsx-props-no-spreading
                {
                  ...field
                }
                isSearchable
                name="consultationContacts"
                options={POC_DISPLAY_OPTIONS}
                localForm={localform}
              />
            )}
          />

        </FormControl>
        </form>

    </Box>)}
  


export default ClientPoCUpdateForm;