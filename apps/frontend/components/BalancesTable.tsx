import { Heading } from '@raidguild/design-system';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { ITokenBalanceLineItem } from '../types';
import { sortNumeric } from '../utils';
import { DataTable } from './DataTable';

export interface BalancesTableProps {
  data: ITokenBalanceLineItem[];
}

const formatTokenAmount = (
  info: CellContext<ITokenBalanceLineItem, string>
) => {
  try {
    const n = BigNumber.from(info.getValue());
    const decimals = Number(info.row.getValue('token_decimals'));
    return n.div(BigNumber.from(10).pow(decimals)).toNumber().toLocaleString();
  } catch (e) {
    console.log(info.row);
    console.error(e);
    return info.getValue().toString();
  }
};

const columnHelper = createColumnHelper<ITokenBalanceLineItem>();

const columns = [
  columnHelper.accessor('token.symbol', {
    id: 'tokenSymbol',
    cell: (info) => info.getValue(),
    header: 'Token',
  }),
  columnHelper.accessor('token.decimals', {
    cell: (info) => info.getValue(),
    header: 'Decimals',
    meta: {
      hidden: true,
    },
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
    <>
      <Heading size='sm'>Balances</Heading>
      <DataTable
        columns={columns}
        data={data}
        sort={[{ id: 'tokenSymbol', desc: false }]}
      />
    </>
  );
};

export default BalancesTable;
