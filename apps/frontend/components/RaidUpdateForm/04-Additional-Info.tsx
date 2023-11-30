import { Box, Text } from "@raidguild/design-system";
import { IRaid } from "@raidguild/dm-types";

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
  }: AdditionalInfoUpdateProps) =>(
    <Box>
      <Text>Additional Info Form</Text>
    </Box>
  )


export default AdditionalInfoUpdateForm;