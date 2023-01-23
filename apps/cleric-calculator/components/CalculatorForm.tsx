import {
  ChakraInput,
  Box,
  Heading,
  Flex,
  Text,
} from '@raidguild/design-system';
import {
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
} from '@chakra-ui/react';
import _ from 'lodash';
import { commify } from 'ethers/lib/utils';
import TotalsRow from './TotalsRow';
import GroupSubtotals from './GroupSubTotals';
import { columns } from '../utils/constants';

interface CalculatorFormProps {
  options: any;
  toggleOption: (group: string, option: string) => void;
  updateOptionValue: (
    group: string,
    option: string,
    key: string,
    value: number
  ) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  options,
  toggleOption,
  updateOptionValue,
  ...props
}) => {
  return (
    <Box w='80%' mt='70px' mx='auto'>
      <Heading py='20px'>Cleric Calculator</Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        {_.map(_.keys(options), (group) => {
          return (
            <AccordionItem key={group}>
              {({ isExpanded }) => (
                <>
                  <Heading size='lg'>
                    <AccordionButton
                      as={Flex}
                      _hover={{ cursor: 'pointer' }}
                      align='center'
                      w='100%'
                    >
                      <Heading size='sm' w='50%'>
                        {_.capitalize(group)}
                      </Heading>
                      {isExpanded ? (
                        <Flex w='40%' justify='space-between'>
                          {_.map(columns, (c) => (
                            <Flex w={c.width}>
                              <Heading as={Box} size='sm' key={c.title}>
                                {c.title}
                              </Heading>
                            </Flex>
                          ))}
                        </Flex>
                      ) : (
                        <GroupSubtotals
                          group={group}
                          options={options}
                          isExpanded
                        />
                      )}
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>

                  <AccordionPanel pb={4}>
                    {_.map(_.keys(options[group]), (option: string) => {
                      const currentOption = options[group][option];
                      return (
                        <Flex align='center' gap={3} my={2} key={option}>
                          <Box w='40%'>
                            <Checkbox
                              size='lg'
                              isChecked={currentOption.active}
                              onChange={() => toggleOption(group, option)}
                            >
                              <Text size='lg'>
                                {_.capitalize(currentOption.title)}
                              </Text>
                            </Checkbox>
                          </Box>
                          <Flex w='50%' justify='space-between'>
                            {_.map(_.keys(columns), (key: string) => (
                              <Flex
                                w={columns[key].width}
                                align='center'
                                key={key}
                              >
                                {key === 'hourly' && (
                                  <Heading pr={3}>$</Heading>
                                )}
                                {key === 'total' ? (
                                  <Text as={Box} size='2xl' mx='auto'>
                                    $
                                    {commify(
                                      currentOption.hourly * currentOption.hours
                                    )}
                                  </Text>
                                ) : (
                                  <ChakraInput
                                    type='number'
                                    placeholder='Hours'
                                    value={currentOption[key]}
                                    isDisabled={!currentOption.active}
                                    onChange={(e) =>
                                      updateOptionValue(
                                        group,
                                        option,
                                        key,
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                )}
                              </Flex>
                            ))}
                          </Flex>
                        </Flex>
                      );
                    })}

                    <GroupSubtotals group={group} options={options} />
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
      <TotalsRow options={options} />
    </Box>
  );
};

export default CalculatorForm;
