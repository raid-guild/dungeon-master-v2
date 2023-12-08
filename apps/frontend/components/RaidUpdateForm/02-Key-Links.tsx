/* eslint-disable camelcase */
import {
  Button,
  forwardRef,
  Input,
  Stack,
} from "@raidguild/design-system";
import { useAddLinks , useLinksByConsultation,useLinksByRaid } from "@raidguild/dm-hooks";
import {
  ILink,
  IRaid,
  LINK_TYPES_ENUM,
} from "@raidguild/dm-types";
import _ from "lodash";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const linkTypes: LINK_TYPES_ENUM = [
  'SPECIFICATION',
  'RETROSPECTIVE',
  'OTHER',
];
  interface KeyLinksUpdateFormProps {
    raidId?: string;
    closeModal?: () => void;
    raid: Partial<IRaid>;
    // consultation:  Partial<IConsultation>;
  }
  const KeyLinksUpdateForm: React.FC<KeyLinksUpdateFormProps> = ({
    raidId,
    closeModal,
    raid,
  }: KeyLinksUpdateFormProps) => {
    
    const { data: session } = useSession();
    const token = _.get(session, "token");
    const [sending, setSending] = useState(false);
    
    const {links} = raid.consultation
    
    
    console.log(links)
    

    const localForm = useForm({
      mode: "all",
    });
    const {
      handleSubmit,
      setValue,
      control,
      formState: { isSubmitting }, // will add errors in once we add validation
    } = localForm;
  
    async function onSubmit(values) {
      setSending(true);
    
      console.log(values);
      // TODO handle links input

      // await updateLinks({
      //   raid_updates: {
      //     link: values.projectSpecs,
      //   },
      // });

      closeModal();
      setSending(false);
    }
  
    // console.log(links) 

  
    const CustomCalInput = forwardRef(({ value, onClick }, ref) => (
      <Button onClick={onClick} ref={ref} variant="outline">
        {value}
      </Button>
    ));
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} gap={4}> 

      {
        linkTypes.map((linkType, index) => (
          
          <Input
            key={linkType}
            name={linkType}
            // eslint-disable-next-line dot-notation
            defaultValue={(_.find(links, {type: linkType}) as ILink )?.link || ''}
            aria-label={linkType}
            placeholder={linkType}
            rounded="base"
            label={linkType}
            localForm={localForm}
          />
        ))
      }

        {/* <Input
                        name="projectSpecs"
                        // eslint-disable-next-line dot-notation
                        defaultValue={_.get(raid["consultation"], "link")}
                        aria-label="Project Specs"
                        placeholder="Link to Project Specs Dcoument"
                        rounded="base"
                        label="Project Specs"
                        localForm={localForm}
                      /> 
         */}
  
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
          Update Key Links
        </Button>
        </Stack>
      </form>
    );
  };
  
  export default KeyLinksUpdateForm;
  