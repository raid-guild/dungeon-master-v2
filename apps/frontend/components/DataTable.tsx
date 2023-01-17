import { useState } from 'react';
import {
  Box,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  ThemingProps,
  Tr,
} from '@chakra-ui/react';
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
  getPaginationRowModel,
} from '@tanstack/react-table';
import Filter from './Filter';
import { Flex, Button, Text, TableContainer } from '@raidguild/design-system';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    dataType?: 'numeric' | 'datetime' | 'enum' | 'string';
    hidden?: boolean;
  }
}

export type DataTableProps<Data extends object> = ThemingProps & {
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
  ...props
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
    initialState: {
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  return (
    <Box border='1px solid grey' borderRadius='4px'>
      <TableContainer maxWidth='90vw'>
        <Table id={id} {...props}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    isNumeric={
                      header.column.columnDef.meta?.dataType === 'numeric'
                    }
                    verticalAlign='top'
                    borderBlock='1px solid gray'
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
                        <Filter column={header.column} />
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
                    isNumeric={
                      cell.column.columnDef.meta?.dataType === 'numeric'
                    }
                    borderBlock='1px solid gray'
                    fontFamily='mono'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex align='center' justifyContent='space-between'>
        <Flex align='center' gap='24px'>
          <Flex>
            <Button
              variant='link'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </Button>
            <Button
              variant='link'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </Button>
            <Button
              variant='link'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </Button>
            <Button
              variant='link'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </Button>
          </Flex>
          <Flex gap='12px'>
            <Text>Page</Text>
            <Text>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </Text>
          </Flex>
          <Box>|</Box>
          <Flex align='center' gap='12px'>
            <label htmlFor='table-go-to-page'>
              <Text>Go to page:</Text>
            </label>
            <Input
              id='table-go-to-page'
              type='number'
              defaultValue={table.getState().pagination.pageIndex + 1}
              maxWidth='80px'
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </Flex>
        </Flex>
        <Select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          maxWidth='150px'
        >
          {[20, 50, 100, 200].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </Flex>
    </Box>
  );
}
