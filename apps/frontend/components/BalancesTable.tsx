import { Link, Tooltip } from '@raidguild/design-system';
import { createColumnHelper } from '@tanstack/react-table';
import { ITokenBalanceLineItem } from '../types';
import { formatNumber, minMaxNumberFilter, sortNumeric } from '../utils';
import { DataTable } from './DataTable';
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
      <Link href={info.row.getValue('tokenExplorerLink')} target='_blank'>
        <Tooltip label='view token'>{info.getValue()}</Tooltip>
      </Link>
    ),
    header: 'Token',
    meta: {
      dataType: 'enum',
    },
  }),
  columnHelper.accessor('inflow.tokenValue', {
    cell: formatNumber,
    header: 'Inflow',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('outflow.tokenValue', {
    cell: formatNumber,
    header: 'Outflow',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
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

const BalancesTable = ({ data }: BalancesTableProps) => {
  return (
    <DataTable
      id='balancesDataTable'
      columns={columns}
      data={data}
      sort={[{ id: 'tokenSymbol', desc: false }]}
    />
  );
};

export default BalancesTable;
