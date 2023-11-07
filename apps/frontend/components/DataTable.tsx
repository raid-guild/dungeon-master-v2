/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  useReactTable,
  flexRender,
  // @ts-ignore ? not sure why these aren't exported
  ColumnFiltersState,
  // @ts-ignore
  ColumnDef,
  // @ts-ignore
  SortingState,
  // @ts-ignore
  RowData,
  // @ts-ignore
  getCoreRowModel,
  // @ts-ignore
  getPaginationRowModel,
  // @ts-ignore
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Flex,
  FormLabel,
  Button,
  Text,
  TableContainer,
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  ThemingProps,
  Tr,
  ChakraSelect,
  ChakraInput,
} from '@raidguild/design-system';
import Filter from './Filter';

export type DataTableProps<TData extends object> = ThemingProps & {
  id: string;
  data: TData[];
  columns: ColumnDef<any, unknown>[];
  sort?: SortingState | (() => SortingState);
};

const DataTable = ({
  id,
  data,
  columns,
  sort = [],
  ...props
}: DataTableProps<object>) => {
  const [sorting, setSorting] = useState<SortingState>(sort);
  const [columnFilters, setColumnFilters] = useState<any | undefined>(
    undefined
  );
  const [columnVisibility, setColumnVisibility] = useState(
    Object.assign(
      {},
      ...columns.map((c: any) => ({ [c.id]: !c.meta?.hidden ?? true }))
    )
  );

  const table = useReactTable({
    columns,
    data,
    onSortingChange: setSorting,
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
                      {/* TODO fix missing method */}
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {/* {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <FiChevronDown aria-label='sorted descending' />
                        ) : (
                          <FiChevronUp aria-label='sorted ascending' />
                        )
                      ) : null} */}
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
            <FormLabel htmlFor={`table-go-to-page-${id}`}>
              <Text>Go to page:</Text>
            </FormLabel>
            <ChakraInput
              id={`table-go-to-page-${id}`}
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
        <ChakraSelect
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
        </ChakraSelect>
      </Flex>
    </Box>
  );
};

export default DataTable;
