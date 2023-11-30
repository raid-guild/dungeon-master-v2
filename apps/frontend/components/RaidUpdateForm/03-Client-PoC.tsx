import { Box, Text } from "@raidguild/design-system";
import { IRaid } from "@raidguild/dm-types";

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
  }: ClientPocUpdateProps) =>(
    <Box>
      <Text>Client Poc Form</Text>
    </Box>
  )


export default ClientPoCUpdateForm;