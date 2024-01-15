import { Link, Tooltip } from '@raidguild/design-system';
import { ITokenBalanceLineItem } from '@raidguild/dm-types';
import { minMaxNumberFilter, sortNumeric } from '@raidguild/dm-utils';
// @ts-expect-error - no types from RT
import { createColumnHelper } from '@tanstack/react-table';

import DataTable from './DataTable';
import TokenWithUsdValue from './TokenWithUsdValue';

interface BalancesTableProps {
  data: ITokenBalanceLineItem[];
}

const columnHelper = createColumnHelper<ITokenBalanceLineItem>();

const columns = [
  columnHelper.accessor('tokenExplorerLink', {
    id: 'tokenExplorerLink',
    cell: (info) => info.getValue(),
    header: 'Token Link',
    meta: {
      hidden: true,
    },
  }),
  columnHelper.accessor('token.symbol', {
    id: 'tokenSymbol',
    cell: (info) => (
      <Link
        href={info.row.getValue('tokenExplorerLink')}
        target='_blank'
        aria-label='tokenExplorerLink'
      >
        <Tooltip label='view token'>{info.getValue()}</Tooltip>
      </Link>
    ),
    header: 'Token',
    meta: {
      dataType: 'enum',
    },
  }),
  columnHelper.accessor('priceConversion', {
    id: 'priceConversion',
    cell: (info) => info.getValue(),
    header: 'Conversion',
    meta: {
      dataType: 'numeric',
      hidden: true,
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('inflow.tokenValue', {
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'Inflow',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('outflow.tokenValue', {
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'Outflow',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('closing.tokenValue', {
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'Balance',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
];

const BalancesTable = ({ data }: BalancesTableProps) => (
  <DataTable
    id='balancesDataTable'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    columns={columns}
    data={data}
    sort={{ id: 'tokenSymbol', desc: false }}
  />
);

export default BalancesTable;
