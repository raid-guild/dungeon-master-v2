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
    dataType?: 'numeric' | 'datetime' | 'string';
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
  const [columnVisibility, setColumnVisibility] = useState(
    Object.assign(
      {},
      ...columns.map((c) => ({ [c.id]: !c.meta?.hidden ?? true }))
    )
  );

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
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
      sorting,
    },
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  return (
    <Table id={id}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id}
                isNumeric={header.column.columnDef.meta?.dataType === 'numeric'}
              >
                <Flex
                  justifyContent='space-between'
                  verticalAlign='middle'
                  onClick={header.column.getToggleSortingHandler()}
                  _hover={{ cursor: 'pointer' }}
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
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td
                key={cell.id}
                isNumeric={cell.column.columnDef.meta?.dataType === 'numeric'}
                borderBlock='1px solid white'
                overflow='clip'
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
