import {
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react';
import { Text, Button } from '@raidguild/design-system';

import styled from '@emotion/styled';

const StyledInput = styled(Input)`
  width: 100%;
  outline: none;
  border: none;
  color: white;
  font-size: 1rem;
  background-color: black;
  margin-bottom: 15px;
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

const StyledFormLabel = styled(FormLabel)`
  font-weight: bold;
`;

export const PaymentsChunkForm = ({
  tokenType,
  paymentDue,
  milestones,
  payments,
  setPayments,
  sendToast,
  updateStep,
}) => {
  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='40%'
    >
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {Array.from(Array(Number(milestones)).keys()).map((count, index) => {
          return (
            <FormControl key={count} isRequired>
              <StyledFormLabel>{`Payment #${index + 1}`}</StyledFormLabel>
              <InputGroup>
                <StyledInput
                  focusBorderColor='none'
                  name={`payment${index + 1}`}
                  type='number'
                  onChange={(e) => {
                    let temp = [...payments];
                    temp[index] = e.target.value;
                    setPayments(temp);
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
          );
        })}
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
          onClick={() => updateStep((prevStep) => prevStep - 1)}
        >
          Back
        </Button>
        <Button
          variant='solid'
          width='100%'
          onClick={() => {
            let sum = payments.reduce((acc, num) => Number(acc) + Number(num));
            if (Number(sum) !== Number(paymentDue))
              return sendToast("Payments didn't add up to due amount.");
            updateStep((prevStep) => prevStep + 1);
          }}
        >
          Next: Confirmation
        </Button>
      </Flex>
    </Flex>
  );
};
