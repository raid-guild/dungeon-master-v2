import { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  useReactTable,
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  RowData,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
} from '@tanstack/react-table';
import Filter from './Filter';
import { Flex } from '@raidguild/design-system';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    isNumeric?: boolean;
    hidden?: boolean;
  }
}

export type DataTableProps<Data extends object> = {
  id: string;
  data: Data[];
  columns: ColumnDef<Data, unknown>[];
  sort?: SortingState;
};

export function DataTable<Data extends object>({
  id,
  data,
  columns,
  sort = [],
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>(sort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <Table id={id}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta;
              return meta?.hidden ? (
                <></>
              ) : (
                <Th key={header.id} isNumeric={meta?.isNumeric}>
                  <Flex
                    justifyContent='space-between'
                    verticalAlign='middle'
                    onClick={header.column.getToggleSortingHandler()}
                    _hover={{cursor: "pointer"}}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === 'desc' ? (
                        <FiChevronDown aria-label='sorted descending' />
                      ) : (
                        <FiChevronUp aria-label='sorted ascending' />
                      )
                    ) : null}
                  </Flex>
                  {header.column.getCanFilter() ? (
                    <Box my='1'>
                      <Filter column={header.column} table={table} />
                    </Box>
                  ) : null}
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
