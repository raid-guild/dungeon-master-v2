import { Badge } from '@chakra-ui/react';

const statusColorScheme = {
  PREPARING: 'yellow',
  RAIDING: 'green',
  SHIPPED: 'blue',
  LOST: 'orange',
  AWAITING: 'red',
};

const RaidStatusBadge = ({ status }) => (
  <Badge colorScheme={statusColorScheme[status]}>{status}</Badge>
);

export default RaidStatusBadge;
