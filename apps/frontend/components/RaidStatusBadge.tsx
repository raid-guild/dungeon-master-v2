import { Badge } from '@raidguild/ui';
import { cn } from '@raidguild/utils';

const statusColorScheme = {
  PREPARING: 'bg-yellow-500 text-yellow-800',
  RAIDING: 'bg-green-500 text-green-800',
  SHIPPED: 'bg-blue-500 text-blue-800',
  LOST: 'bg-orange-500 text-orange-800',
  AWAITING: 'bg-red-500 text-red-800',
} as const;

const RaidStatusBadge = ({ status }: { status: any }) => (
  <Badge
    className={cn(
      statusColorScheme[status],
      `font-texturina font-semibold rounded-sm fill-transparent`
    )}
  >
    {status}
  </Badge>
);

export default RaidStatusBadge;
