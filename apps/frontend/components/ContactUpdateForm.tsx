import { Box, Button, Input, Stack } from "@raidguild/design-system";
import { IContact } from "@raidguild/dm-types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import { object } from "yup";

const ContactUpdateForm = ({contact}: {contact: IContact}) => {


  

  const contactInfos = _.map(contact["contactInfo"], (value:string, label:string) => ({ label, value }));



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

                <Button type="submit" w={'full'}>Submit</Button>
                </Stack>
        
      </form>
    </Box>
  );
};

export default ContactUpdateForm;
