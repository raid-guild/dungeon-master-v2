/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { ChakraInput, ChakraInputProps } from '@raidguild/design-system';

type DebouncedInputProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  debounce?: number;
} & Omit<ChakraInputProps, 'onChange'>;

// A debounced input react component
const DebouncedInput = <T extends string | number>({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps<T>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <ChakraInput
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value as T)}
    />
  );
};

export default DebouncedInput;
