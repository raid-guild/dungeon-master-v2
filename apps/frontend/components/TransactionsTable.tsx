import { Link, TableContainer } from '@raidguild/design-system';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { BigNumber, utils } from 'ethers';
import { IVaultTransaction } from '../types';
import { sortNumeric, truncateAddress } from '../utils';
import { DataTable } from './DataTable';

export interface TransactionsTableProps {
  data: IVaultTransaction[];
}

const formatTokenAmount = (info: CellContext<IVaultTransaction, BigNumber>) => {
  try {
    const n = info.getValue();
    const decimals = Number(info.row.getValue('tokenDecimals'));
    return Number(utils.formatUnits(n, decimals)).toLocaleString();
  } catch (e) {
    console.error(e);
    return info.getValue().toString();
  }
};

const formatTokenValue = (info: CellContext<IVaultTransaction, BigNumber>) => {
  try {
    const n = info.getValue();
    const decimals = Number(info.row.getValue('tokenDecimals'));
    const priceConversion = Number(info.row.getValue('priceConversion'));
    if (!priceConversion) {
      return 'Unknown value';
    }
    const tokenValue = Number(utils.formatUnits(n, decimals)) * priceConversion;
    return `$${tokenValue.toLocaleString()}`;
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
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('elapsedDays', {
    cell: (info) =>
      info.row.getValue('net') > 0 ? info.getValue() : undefined,
    header: 'Days Held',
    sortingFn: sortNumeric,
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
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('priceConversion', {
    cell: (info) => info.getValue(),
    header: 'Conversion',
    meta: {
      hidden: true,
    },
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('net', {
    cell: (info) => (
      <div>
        <p>{formatTokenAmount(info)}</p>
        <p>{formatTokenValue(info)}</p>
      </div>
    ),
    header: 'Amount',
    meta: {
      isNumeric: true,
    },
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('balance', {
    cell: formatTokenAmount,
    // (info) => {
    //   const usdValue = formatTokenValue(info);
    //   return usdValue ? (
    //     <div>
    //       <p>{formatTokenAmount(info)}</p>
    //       <p>{usdValue}</p>
    //     </div>
    //   ) : (
    //     formatTokenAmount(info)
    //   );
    // },
    header: 'Balance',
    meta: {
      isNumeric: true,
    },
    sortingFn: sortNumeric,
  }),
  //   columnHelper.accessor('proposal.loot', {
  //     cell: (info) => info?.getValue()?.toString(),
  //     header: 'Loot',
  //     meta: {
  //       isNumeric: true,
  //     },
  //    sortingFn: sortNumeric,
  //   }),
  columnHelper.accessor('proposal.shares', {
    cell: (info) => info.getValue().toNumber(),
    header: 'Shares',
    meta: { isNumeric: true },
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('proposal.link', {
    cell: (info) => info.getValue(),
    meta: { hidden: true },
    header: 'Proposal Link',
  }),
  columnHelper.accessor('proposal', {
    cell: (info) => (
      <Link href={info.getValue().link} target='_blank'>
        {info.getValue().title}
      </Link>
    ),
    header: 'Proposal',
  }),
  columnHelper.accessor('counterparty', {
    cell: (info) => truncateAddress(info.getValue()),
    header: 'Counterparty',
  }),
  columnHelper.accessor('txExplorerLink', {
    cell: (info) => (
      <Link href={info.getValue()} target='_blank'>
        view
      </Link>
    ),
    header: 'Tx',
  }),
];

const TransactionsTable = ({ data }: TransactionsTableProps) => {
  return (
    <TableContainer border='1px solid grey' borderRadius='4px' maxWidth='90vw'>
      <DataTable id="transactionsDataTable" columns={columns} data={data} />
    </TableContainer>
  );
};

export default TransactionsTable;
