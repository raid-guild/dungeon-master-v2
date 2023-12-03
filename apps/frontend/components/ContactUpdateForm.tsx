import { Box, Button, Input, Stack } from "@raidguild/design-system";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const ContactUpdateForm = ({id, token}: {id: string, token: string}) => {
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
              <Stack spacing={4}>
                <Input
                  name="name"
                //   defaultValue={}
                  aria-label="Enter your name"
                  placeholder="What is your name?"
                  rounded="base"
                  label="Member Name"
                  localForm={localForm}
                />
                </Stack>
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

export default ContactUpdateForm;
