import { Link } from '@raidguild/design-system';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { IVaultTransaction } from '../types';
import { DataTable } from './DataTable';

export interface TransactionsTableProps {
  data: IVaultTransaction[];
}

const formatTokenAmount = (info: CellContext<IVaultTransaction, BigNumber>) => {
  try {
    const n = info.getValue();
    const decimals = Number(info.row.getValue('tokenDecimals'));
    return n.div(BigNumber.from(10).pow(decimals)).toNumber().toLocaleString();
  } catch (e) {
    console.error(e);
    return info.getValue().toString();
  }
};

const columnHelper = createColumnHelper<IVaultTransaction>();

const columns = [
  columnHelper.accessor('date', {
    cell: (info) => info.getValue().toLocaleString(),
    header: 'Date',
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    header: 'Type',
  }),
  columnHelper.accessor('tokenSymbol', {
    cell: (info) => info.getValue(),
    header: 'Token',
  }),
  columnHelper.accessor('tokenDecimals', {
    cell: (info) => info.getValue(),
    header: 'Decimals',
    meta: {
      hidden: true,
    },
  }),
  columnHelper.accessor('net', {
    cell: formatTokenAmount,
    header: 'Amount',
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('balance', {
    cell: formatTokenAmount,
    header: 'Balance',
    meta: {
      isNumeric: true,
    },
  }),
//   columnHelper.accessor('proposal.loot', {
//     cell: (info) => info?.getValue()?.toString(),
//     header: 'Loot',
//     meta: {
//       isNumeric: true,
//     },
//   }),
  columnHelper.accessor('proposal.shares', {
    cell: (info) => info.getValue().toNumber(),
    header: 'Shares',
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor('proposal', {
    cell: (info) => <Link href={info.getValue().link} target="_blank">{info.getValue().title}</Link>,
    header: 'Proposal',
  }),
  columnHelper.accessor('counterparty', {
    cell: (info) => info.getValue(),
    header: 'Counterparty',
  }),
  columnHelper.accessor('txExplorerLink', {
    cell: (info) => <Link href={info.getValue()} target="_blank">view</Link>,
    header: 'Tx',
  }),
];

const TransactionsTable = ({ data }: TransactionsTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default TransactionsTable;
