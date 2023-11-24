import {
  Button,
  ChakraInput,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
} from '@raidguild/design-system';
import _ from 'lodash';
import { useForm, UseFormReturn } from 'react-hook-form';

// TODO migrate to design system

const PaymentsChunkForm = ({
  escrowForm,
  updateStep,
  backStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: () => void;
  backStep: () => void;
}) => {
  const { watch } = escrowForm;
  const { paymentDue, milestones, tokenType, payments } = watch();
  const localForm = useForm();
  const { setValue } = localForm;

  const sum = _.sum(payments);

  const onSubmit = (values) => {
    console.log(values);
    updateStep();
  };

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='40%'
    >
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {Array.from(Array(_.size(milestones))).map((count, index) => (
          <FormControl key={count} isRequired>
            <FormLabel>{`Payment #${index + 1}`}</FormLabel>
            <InputGroup>
              <ChakraInput
                focusBorderColor='none'
                name={`payment${index + 1}`}
                type='number'
                onChange={(e) => {
                  const temp = [...payments];
                  temp[index] = e.target.value;
                  setValue('payments', temp);
                }}
                value={payments[index]}
              />
              <InputRightElement
                fontFamily='texturina'
                color='yellow'
                w='3.5rem'
                mr='.5rem'
              >
                {tokenType}
              </InputRightElement>
            </InputGroup>
          </FormControl>
        ))}
      </div>

      <Text color='white' textTransform='uppercase' fontFamily='texturina'>
        The sum should add up to {paymentDue} {tokenType}
      </Text>

      <Flex direction='row' width='100%' mt='1rem'>
        <Button
          variant='outline'
          minW='25%'
          p='5px'
          mr='.5rem'
          onClick={backStep}
        >
          Back
        </Button>
        <Button
          type='submit'
          variant='solid'
          width='100%'
          isDisabled={_.size(payments) !== milestones || !(sum === paymentDue)}
        >
          Next: Confirmation
        </Button>
      </Flex>
    </Flex>
  );
};

export default PaymentsChunkForm;
