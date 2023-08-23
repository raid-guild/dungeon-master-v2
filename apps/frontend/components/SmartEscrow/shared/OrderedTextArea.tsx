import { VStack, Flex, Text, Tooltip, Textarea } from '@chakra-ui/react';
import { QuestionIcon } from '../icons/QuestionIcon';

type OrderedTextAreaType = {
  label: string;
  value: string;
  setValue: any;
  infoText?: string;
  tooltip: string;
  placeholder: string;
  maxLength?: number;
  isDisabled?: boolean;
};
export const OrderedTextarea = ({
  label,
  value,
  setValue,
  infoText,
  tooltip,
  placeholder = '',
  maxLength,
  isDisabled = false,
}: OrderedTextAreaType) => {
  return (
    <VStack
      w='100%'
      spacing='0.5rem'
      justify='space-between'
      color='primary.300'
    >
      <Flex justify='space-between' w='100%'>
        <Text fontFamily='texturina' fontWeight='700' color='primary.300'>
          {label}
        </Text>
        <Flex>
          {infoText && <Text fontSize='xs'>{infoText}</Text>}
          {tooltip && (
            <Tooltip label={tooltip} placement='auto-start'>
              <QuestionIcon ml='1rem' boxSize='0.75rem' color='primary.300' />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      <Textarea
        bg='black'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        color='white'
        border='none'
        isDisabled={isDisabled}
        h='4rem'
        resize='none'
        maxLength={maxLength}
      />
    </VStack>
  );
};
