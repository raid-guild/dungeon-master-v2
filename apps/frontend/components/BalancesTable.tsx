import { Link, TableContainer } from '@raidguild/design-system';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { BigNumber, utils } from 'ethers';
import { ITokenBalanceLineItem } from '../types';
import { sortNumeric } from '../utils';
import { DataTable } from './DataTable';

export interface BalancesTableProps {
  data: ITokenBalanceLineItem[];
}

const formatTokenAmount = (
  info: CellContext<ITokenBalanceLineItem, BigNumber>
) => {
  try {
    const n = BigNumber.from(info.getValue());
    const decimals = Number(info.row.getValue('token_decimals'));
    return Number(utils.formatUnits(n, decimals)).toLocaleString();
  } catch (e) {
    console.log(info.row);
    console.error(e);
    return info.getValue().toString();
  }
};

const columnHelper = createColumnHelper<ITokenBalanceLineItem>();

const columns = [
  columnHelper.accessor('tokenExplorerLink', {
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
        {info.getValue()}
      </Link>
    ),
    header: 'Token',
  }),
  columnHelper.accessor('token.decimals', {
    cell: (info) => info.getValue(),
    header: 'Decimals',
    meta: {
      hidden: true,
    },
  }),
  columnHelper.accessor('inflow.tokenValue', {
    cell: formatTokenAmount,
    header: 'Inflow',
    meta: {
      isNumeric: true,
    },
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('outflow.tokenValue', {
    cell: formatTokenAmount,
    header: 'Outflow',
    meta: {
      isNumeric: true,
    },
    sortingFn: sortNumeric,
  }),
  columnHelper.accessor('tokenBalance', {
    cell: formatTokenAmount,
    header: 'Balance',
    meta: {
      isNumeric: true,
    },
    sortingFn: sortNumeric,
  }),
];

const BalancesTable = ({ data }: BalancesTableProps) => {
  return (
    <TableContainer border='1px solid grey' borderRadius='4px'>
      <DataTable
        id='balancesDataTable'
        columns={columns}
        data={data}
        sort={[{ id: 'tokenSymbol', desc: false }]}
      />
    </TableContainer>
  );
};

export default BalancesTable;
