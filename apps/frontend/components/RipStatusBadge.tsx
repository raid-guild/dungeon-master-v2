import { Badge } from '@raidguild/design-system';

const statusColorScheme = {
  Proposed: 'red',
  Consideration: 'orange',
  Submitted: 'yellow',
  'In Progress': 'green',
  Document: 'blue',
  Final: 'purple',
};

const RipStatusBadge = ({ status }: { status: string }) => (
  <Badge colorScheme={statusColorScheme[status]}>{status}</Badge>
);

export default RipStatusBadge;
