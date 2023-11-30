import { Box, Text } from "@raidguild/design-system";
import { IRaid } from "@raidguild/dm-types";

interface PortfolioUpdateProps {
    raidId?: string;
    closeModal?: () => void;
    raid: Partial<IRaid>;
    // consultation:  Partial<IConsultation>;
  }

const PortfolioUpdateForm: React.FC<PortfolioUpdateProps> = ({
    raidId,
    closeModal,
    raid,
  }: PortfolioUpdateProps) =>(
    <Box>
      <Text>Portfolio Update Form</Text>
    </Box>
  )


export default PortfolioUpdateForm;