/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  VStack,
} from '@raidguild/design-system';

const RadioCard = ({ children, ...props }: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        color='yellow'
        boxShadow='md'
        border='1px solid'
        borderColor='yellow'
        borderRadius='md'
        fontFamily="'JetBrains Mono', monospace"
        _checked={{
          bg: 'yellow',
          color: 'black',
          borderColor: 'teal.600',
        }}
        px={2}
        py={2}
      >
        {children}
      </Box>
    </Box>
  );
};

const RadioBox = ({ name, defaultValue, updateRadio, stack, options }: any) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange: (e) => {
      updateRadio(e);
    },
  });

  const group = getRootProps();

  return stack === 'vertical' ? (
    <VStack {...group} style={{ alignItems: 'inherit' }}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </VStack>
  ) : (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
};

export default RadioBox;
