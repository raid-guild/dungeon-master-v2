import { Button, Input, Stack } from "@raidguild/design-system";
import { IRaid } from "@raidguild/dm-types";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AdditionalInfoUpdateProps {
    raidId?: string;
    closeModal?: () => void;
    raid: Partial<IRaid>;
    // consultation:  Partial<IConsultation>;
  }

const AdditionalInfoUpdateForm: React.FC<AdditionalInfoUpdateProps> = ({
    raidId,
    closeModal,
    raid,
  }: AdditionalInfoUpdateProps) =>{
    const {escrowIndex, lockerHash, invoiceAddress} = raid;

    const [sending, setSending] = useState(false);

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
      
      <form>
        <Stack gap={4}>
        <Input
          name="escrowIndex"
          defaultValue={escrowIndex}
          aria-label="escrowIndex"
          placeholder="escrowIndex"
          rounded="base"
          label="Escrow Index"
          localForm={localForm}
        />
        <Input
          name="lockerHash"
          defaultValue={lockerHash}
          aria-label="lockerHash"
          placeholder="lockerHash"
          rounded="base"
          label="Locker Hash"
          localForm={localForm}
        />
        <Input
          name="invoiceAddress"
          defaultValue={invoiceAddress}
          aria-label="invoiceAddress"
          placeholder="invoiceAddress"
          rounded="base"
          label="Invoice Address"
          localForm={localForm}
        />
        
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
          Update Info
        </Button>
        </Stack>
      </form>

    )
  }


export default AdditionalInfoUpdateForm;