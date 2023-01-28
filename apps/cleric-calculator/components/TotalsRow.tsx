import React from 'react';
import { Heading, Flex } from '@raidguild/design-system';
import _ from 'lodash';
import { commify } from 'ethers/lib/utils';
import { columns } from '../utils/constants';

interface TotalsRowProps {
  options: any;
}

const TotalsRow: React.FC<TotalsRowProps> = ({ options }) => {
  const flatOptions = {
    ...options.specification,
    ...options.content,
    ...options.design,
    ...options.development,
  };
  const allActiveOptions = _.filter(flatOptions, ['active', true]);

  const totalSum = Math.trunc(_.divide(
    _.sum(_.map(allActiveOptions, (o: any) => o.hours * o.hourly)),
    0.7
  ));

  const totalValue = (column: string) => {
    if (column === 'total') return totalSum;
    if (column === 'hourly') return _.meanBy(allActiveOptions, 'hourly');
    return _.sumBy(allActiveOptions, column);
  };

  const overheadColumns = [
    {
      name: 'Project Manager',
      percent: 10,
    },
    {
      name: 'Cleric',
      percent: 10,
    },
    {
      name: 'Guild Spoils',
      percent: 10,
    },
  ];

  // TODO update the maths below here for PM/Cleric/Spoils
  return (
    <Flex align='flex-end' borderTop='1px' borderTopColor='whiteAlpha.700'>
      <Heading w='40%' textAlign='right' size='md' mb={2} pr={4}>
        Totals
      </Heading>

      <Flex direction='column' w='50%' h='200px' justify='space-around'>
        {_.map(overheadColumns, (column) => (
          <Flex justify='center' key={column.name}>
            <Heading size='sm'>
              {`${column.name} => ${column.percent}% ($${commify(
                Math.trunc(totalValue('total') * (column.percent / 100))
              )})`}
            </Heading>
          </Flex>
        ))}

        <Flex borderTop='1px' borderTopColor='whiteAlpha.400' mt={4}>
          {_.map(_.keys(columns), (column) => (
            <Flex
              justify='center'
              align='center'
              w={columns[column].width}
              key={column}
            >
              <Heading size='sm'>
                {(column === 'hourly' || column === 'total') && '$'}
                {column === 'total'
                  ? commify(totalValue(column))
                  : totalValue(column) || 0}
              </Heading>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TotalsRow;
