import { Flex } from '@raidguild/design-system';
import { Column } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import DebouncedInput from './DebouncedInput';

export type FilterProps<TData, TValue> = {
  column: Column<TData, TValue>;
};

const Filter = <TData, TValue>({ column }: FilterProps<TData, TValue>) => {
  const columnFilterValue = column.getFilterValue();
  const columnDataType = column.columnDef.meta?.dataType ?? 'string';

  const sortedUniqueValues = useMemo(
    () =>
      columnDataType === 'enum'
        ? Array.from(column.getFacetedUniqueValues().keys()).sort()
        : [],
    [column, columnDataType]
  );

  const handleMinChange = useCallback(
    <T extends number | string>(value: T) => {
      column.setFilterValue((old: [T, T]) => [value, old?.[1]]);
    },
    [column]
  );

  const handleMaxChange = useCallback(
    <T extends number | string>(value: T) => {
      column.setFilterValue((old: [T, T]) => [old?.[0], value]);
    },
    [column]
  );

  const handleChange = useCallback(
    (value: string) => column.setFilterValue(value),
    [column]
  );

  if (columnDataType === 'numeric') {
    const minMax = column.getFacetedMinMaxValues();

    return (
      <Flex direction='column'>
        <DebouncedInput
          type='number'
          step='any'
          min={Number(minMax?.[0] ?? '')}
          max={Number(minMax?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={handleMinChange}
          placeholder={`min ${minMax?.[0] ? minMax?.[0].toLocaleString() : ''}`}
          size='sm'
          fontFamily='mono'
          fontSize='xs'
        />
        <DebouncedInput
          type='number'
          step='any'
          min={Number(minMax?.[0] ?? '')}
          max={Number(minMax?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={handleMaxChange}
          placeholder={`max ${minMax?.[1] ? minMax?.[1].toLocaleString() : ''}`}
          size='sm'
          fontFamily='mono'
          fontSize='xs'
        />
      </Flex>
    );
  }

  if (columnDataType === 'datetime') {
    const min = sortedUniqueValues[0] as Date;
    const max = sortedUniqueValues[sortedUniqueValues.length - 1] as Date;

    return (
      <Flex direction='column'>
        <DebouncedInput
          type='date'
          step='any'
          min={min?.toDateString()}
          max={max?.toDateString()}
          value={(columnFilterValue as [string, string])?.[0] ?? ''}
          onChange={handleMinChange}
          placeholder={`min ${min ? min.toLocaleDateString() : ''}`}
          size='sm'
          fontFamily='mono'
          fontSize='xs'
        />
        <DebouncedInput
          type='date'
          step='any'
          min={max?.toDateString() ?? ''}
          max={max?.toDateString() ?? ''}
          value={(columnFilterValue as [string, string])?.[1]}
          onChange={handleMaxChange}
          placeholder={`max ${max ? max.toLocaleDateString() : ''}`}
          size='sm'
          fontFamily='mono'
          fontSize='xs'
        />
      </Flex>
    );
  }

  if (columnDataType === 'enum') {
    return (
      <Flex>
        <datalist id={column.id + 'list'}>
          {sortedUniqueValues.slice(0, 5000).map((value?: string | number) => {
            return value ? (
              <option value={value.toString()} key={value.toString()} />
            ) : (
              <></>
            );
          })}
        </datalist>
        <DebouncedInput
          type='text'
          value={(columnFilterValue ?? '') as string}
          onChange={handleChange}
          placeholder={`search... (${column.getFacetedUniqueValues().size})`}
          className='border shadow rounded'
          list={column.id + 'list'}
          size='sm'
          fontFamily='mono'
          fontSize='xs'
        />
      </Flex>
    );
  }

  return (
    <Flex>
      <DebouncedInput
        type='text'
        value={(columnFilterValue ?? '') as string}
        onChange={handleChange}
        placeholder={`search... (${column.getFacetedUniqueValues().size})`}
        className='border shadow rounded'
        size='sm'
        fontFamily='mono'
        fontSize='xs'
      />
    </Flex>
  );
};

export default Filter;
