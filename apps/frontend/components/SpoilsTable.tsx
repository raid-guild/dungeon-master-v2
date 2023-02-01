import { Link, Tooltip } from '@raidguild/design-system';
import { createColumnHelper } from '@tanstack/react-table';
import { ISpoils } from '../types';
import { minMaxDateFilter, minMaxNumberFilter, sortNumeric } from '../utils';
import DataTable from './DataTable';
import TokenWithUsdValue from './TokenWithUsdValue';

interface SpoilsTableProps {
  data: ISpoils[];
}

const columnHelper = createColumnHelper<ISpoils>();

const columns = [
  columnHelper.accessor('date', {
    cell: (info) => info.getValue().toLocaleString(),
    header: 'Date',
    meta: {
      dataType: 'datetime',
    },
    filterFn: minMaxDateFilter,
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('raidLink', {
    id: 'raidLink',
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
    meta: { hidden: true },
  }),
  columnHelper.accessor('raidName', {
    cell: (info) => (
      <Link
        href={info.row.getValue('raidLink')}
        target='_blank'
        aria-label='raidLink'
      >
        <Tooltip label='view raid'>
          <span>{info.getValue()}</span>
        </Tooltip>
      </Link>
    ),
    header: 'Raid',
  }),
  columnHelper.accessor('tokenSymbol', {
    cell: (info) => info.getValue(),
    header: 'Token',
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
  columnHelper.accessor('parentShare', {
    id: 'parentShare',
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'To DAO Treasury',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),

  columnHelper.accessor('childShare', {
    id: 'childShare',
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'To Raid Party',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
];

const SpoilsTable = ({ data }: SpoilsTableProps) => (
  <DataTable
    id='spoilsDataTable'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    columns={columns}
    data={data}
    size='sm'
  />
);

export default SpoilsTable;
