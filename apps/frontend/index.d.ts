/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'lodash';

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '@tanstack/table-core' {
  interface Column<TData, TValue> {
    id: string;
    setFilterValue: any;
    columnDef: ColumnDef<TData, TValue>;
    getFilterValue: () => [number, number] | [string, string];
    getFacetedMinMaxValues: () => { min: TValue; max: TValue };
    getFacetedUniqueValues: () => {
      size: number;
      values: TValue[];
      keys: () => number[] | Date[];
    };
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    dataType?: 'numeric' | 'datetime' | 'enum' | 'string';
    hidden?: boolean;
  }

  interface ColumnDef<TData extends RowData, TValue> {
    meta?: ColumnMeta<TData, TValue>;
  }

  interface ColumnHelper<TData extends RowData> {
    column: ColumnDef<TData, any>;
    getDataType: () => 'numeric' | 'datetime' | 'enum' | 'string';
    isHidden: () => boolean;
    accessor: (string, object) => void;
  }

  interface ColumnFiltersState<TData extends RowData> {
    [key: string]: string;
  }

  interface SortingState {
    id: string;
    desc: boolean;
  }

  interface Row {
    id: string;
  }

  interface RowData {
    id: string;
  }

  interface CellContext<TRow, number> {
    column: Column<TData, any>;
    row: TData;
    value: any;
    getValue: () => any;
  }

  function createColumnHelper<TData extends RowData>(): ColumnHelper<TData>;
}
