import { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  RowData,
} from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    isNumeric?: boolean;
    hidden?: boolean;
  }
}

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, unknown>[];
  sort?: SortingState;
};

export function DataTable<Data extends object>({
  data,
  columns,
  sort = [],
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>(sort);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta;
              return meta?.hidden ? (
                <></>
              ) : (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  <chakra.span pl='4'>
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === 'desc' ? (
                        <FiChevronDown aria-label='sorted descending' />
                      ) : (
                        <FiChevronUp aria-label='sorted ascending' />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              const meta = cell.column.columnDef.meta;
              return meta?.hidden ? (
                <></>
              ) : (
                <Td
                  key={cell.id}
                  isNumeric={meta?.isNumeric}
                  borderBlock='1px solid white'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
