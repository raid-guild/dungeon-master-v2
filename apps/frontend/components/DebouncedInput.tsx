import { useEffect, useState } from 'react';
import { Input, InputProps } from '@chakra-ui/react';

type DebouncedInputProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  debounce?: number;
} & Omit<InputProps, 'onChange'>;

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
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value as T)}
    />
  );
};

export default DebouncedInput;
