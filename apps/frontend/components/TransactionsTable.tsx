import { Link, Tooltip } from '@raidguild/design-system';
import { createColumnHelper } from '@tanstack/react-table';
import { IVaultTransaction } from '../types';
import {
  formatNumber,
  minMaxDateFilter,
  minMaxNumberFilter,
  sortNumeric,
  truncateAddress,
} from '../utils';
import DataTable from './DataTable';
import TokenWithUsdValue from './TokenWithUsdValue';

interface TransactionsTableProps {
  data: IVaultTransaction[];
}

const columnHelper = createColumnHelper<IVaultTransaction>();

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
  columnHelper.accessor('elapsedDays', {
    id: 'elapsedDays',
    cell: (info) => info.getValue(),
    header: 'Days Held',
    meta: {
      dataType: 'numeric',
      hidden: true,
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    header: 'Type',
    meta: {
      dataType: 'enum',
    },
  }),
  columnHelper.accessor('tokenSymbol', {
    cell: (info) => info.getValue(),
    header: 'Token',
    meta: {
      dataType: 'enum',
    },
  }),
  columnHelper.accessor('tokenDecimals', {
    id: 'tokenDecimals',
    cell: (info) => info.getValue(),
    header: 'Decimals',
    meta: {
      dataType: 'numeric',
      hidden: true,
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
  columnHelper.accessor('net', {
    id: 'net',
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'Amount',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('balance', {
    id: 'balance',
    cell: (info) => <TokenWithUsdValue info={info} />,
    header: 'Balance',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('memberLink', {
    id: 'memberLink',
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
    meta: { hidden: true },
  }),
  columnHelper.accessor('memberName', {
    cell: (info) =>
      info.row.getValue('memberLink') ? (
        <Link
          href={info.row.getValue('memberLink')}
          target='_blank'
          aria-label='memberLink'
        >
          <Tooltip label={`view ${info.getValue()}'s profile`}>
            <span>{info.getValue()}</span>
          </Tooltip>
        </Link>
      ) : (
        <span>{info.getValue()}</span>
      ),
    header: 'Member',
  }),
  columnHelper.accessor('proposalLink', {
    id: 'proposalLink',
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
    meta: { hidden: true },
  }),
  columnHelper.accessor('proposalTitle', {
    cell: (info) => (
      <Link
        href={info.row.getValue('proposalLink')}
        target='_blank'
        aria-label='proposalLink'
      >
        <Tooltip label='view proposal on DAOhaus'>
          <span>{info.getValue()}</span>
        </Tooltip>
      </Link>
    ),
    header: 'Proposal',
  }),
  columnHelper.accessor('proposalLoot', {
    id: 'proposalLoot',
    cell: formatNumber,
    header: 'Loot',
    meta: {
      dataType: 'numeric',
      hidden: true,
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('proposalShares', {
    id: 'proposalShares',
    cell: formatNumber,
    header: 'Shares',
    meta: {
      dataType: 'numeric',
    },
    filterFn: minMaxNumberFilter,
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('counterparty', {
    cell: (info) => (
      <Tooltip label={info.getValue()}>
        <span>{truncateAddress(info.getValue())}</span>
      </Tooltip>
    ),
    header: 'Counterparty',
  }),
  columnHelper.accessor('txExplorerLink', {
    cell: (info) => (
      <Link href={info.getValue()} target='_blank' aria-label='txExplorerLink'>
        <Tooltip label='view transaction explorer'>view</Tooltip>
      </Link>
    ),
    enableColumnFilter: false,
    header: 'Tx',
  }),
];

const TransactionsTable = ({ data }: TransactionsTableProps) => (
  <DataTable
    id='transactionsDataTable'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    columns={columns}
    data={data}
    size='sm'
  />
);

export default TransactionsTable;
