import { Box, Button, Input, Stack } from "@raidguild/design-system";
import { IContact } from "@raidguild/dm-types";
import _ from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";

const contactOptions = ["email", "discord", "github", "twitter", "telegram"]

const ContactUpdateForm = ({contact}: {contact: IContact}) => {

const [sending, setSending] = useState(false);
  

  const contactInfos = _.map(contactOptions, (option) => (
    contact.contactInfo[option] ? {label: option, value: contact.contactInfo[option]} :
    { label: option, value: "" }));

console.log(contactInfos)

    const localForm = useForm({
        mode: "all",
      });
      
      const {
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting },
      } = localForm;

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <Box>
       <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4} gap={4}>
                <Input
                  name="Contact name"
                 defaultValue={contact.name}
                  aria-label="Contact Name"
                  placeholder="Contact Name"
                  rounded="base"
                  label="Member Name"
                
                  localForm={localForm}
                />
                <Input
                  name="Bio"
                 defaultValue={contact.bio}
                  aria-label="Contact Name"
                  placeholder="Contact Name"
                  rounded="base"
                  label="Bio"
                  
                  localForm={localForm}
                />

        {_.map(contactInfos, ({label, value}: {label: string, value: string}) => {

          return (
            <Input
              name={label}
              defaultValue={value}
              aria-label={label}
              placeholder={label}
              rounded="base"
              label={label.charAt(0).toUpperCase() + label.slice(1)}
              localForm={localForm}
            />
          );
        })}

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
                >Submit</Button>
                </Stack>
        
      </form>
    </Box>
  );
};

export default ContactUpdateForm;
