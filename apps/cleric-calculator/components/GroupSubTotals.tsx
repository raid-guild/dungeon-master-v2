import React from "react";
import { Heading, Flex } from "@raidguild/design-system";
import _ from "lodash";
import { commify } from "ethers/lib/utils";
import { columns } from "../utils/constants";

interface GroupSubTotalsProps {
  group: string;
  options: any;
  isExpanded?: boolean;
}

const GroupSubtotals: React.FC<GroupSubTotalsProps> = ({
  group,
  options,
  isExpanded,
}) => {
  const columnSubTotalForGroup = (group: string, column: string) => {
    const activeOptions = _.filter(options[group], ["active", true]);
    if (column === "hourly") {
      return _.size(activeOptions) > 0
        ? _.meanBy(activeOptions, column).toFixed(2)
        : 0;
    }
    if (column === "total") {
      return commify(_.sum(_.map(activeOptions, (o) => o.hours * o.hourly)));
    }

    return _.sumBy(activeOptions, column) || 0;
  };

  const totals = () => (
    <Flex w="70%" justify="space-between">
      {!isExpanded && (
        <Flex w="40%" justify="flex-end">
          <Heading size="xs" pr={4}>
            {`${_.capitalize(group)} Subtotal`}
          </Heading>
        </Flex>
      )}

      <Flex w="70%" justify="space-between">
        {_.map(_.keys(columns), (column) => (
          <Flex
            justify="center"
            align="center"
            w={columns[column].width}
            key={column}
          >
            <Heading size="sm">
              {(column === "hourly" || column === "total") && "$"}
              {columnSubTotalForGroup(group, column) || 0}
            </Heading>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );

  return isExpanded ? (
    <Flex justify="flex-end" w="100%">
      {totals()}
    </Flex>
  ) : (
    <>{totals()}</>
  );
};

export default GroupSubtotals;
