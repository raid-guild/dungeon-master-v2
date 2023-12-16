import { Badge } from '@raidguild/design-system';

const statusColorScheme = {
  PREPARING: 'yellow',
  RAIDING: 'green',
  SHIPPED: 'blue',
  LOST: 'orange',
  AWAITING: 'red',
};

const RaidStatusBadge = ({ status }: { status: any }) => (
  <Badge colorScheme={statusColorScheme[status]} px={1.5} py={1} fontFamily="texturina" textTransform='initial' fill="transparent" border="1px" borderRadius="4px">{status}</Badge>
);

export default RaidStatusBadge;
