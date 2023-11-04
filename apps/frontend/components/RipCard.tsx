import {
  Button,
  Card,
  Collapse,
  Collapse,
  Flex,
  Heading,
  HStack,
  Icon,
  Icon,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@raidguild/design-system";
import { IRip } from "@raidguild/dm-types";
import { displayDate } from "@raidguild/dm-utils";
import _ from "lodash";
import { useState } from "react";
import { FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";

import Link from "./ChakraNextLink";
import RipStatusBadge from "./RipStatusBadge";

interface RipProps {
  rip: IRip;
}

const RipCard = ({ rip }: RipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const description = _.get(rip, "bodyText", "");
  const link = _.get(rip, "url");
  const ripStatus = _.get(rip, "ripCategory");
  const raidDate = _.get(rip, "createdAt");
  const ripDateLabel = "Created on: ";
  const ripNumber = _.get(rip, "number");
  const updates = _.map(rip.comments.nodes, (node: any) => ({
    createdAt: node?.createdAt,
    id: node?.id,
    member: {
      name: _.get(node, "author.login"),
    },
    update: node?.bodyText,
  }));
  const latestUpdate = updates ? updates[updates.length - 1] : null;

  return (
    <LinkBox h="100%">
      <Card variant="filled" p={3} w={["95%", null, null, "100%"]}>
        <Flex
          w="100%"
          direction={{ base: "column", md: "row" }}
          alignItems="space-apart"
          justifyContent="space-between"
        >
          <Stack spacing={4}>
            <LinkOverlay as={Link} href={link}>
              <Heading
                color="white"
                as="h3"
                fontSize="2xl"
                transition="all ease-in-out .25s"
                _hover={{ cursor: "pointer", color: "red.100" }}
              >
                {_.get(rip, "title")}
              </Heading>
            </LinkOverlay>
            <HStack>
              <RipStatusBadge status={ripStatus} />
            </HStack>
          </Stack>
          {
            /* <Flex direction={{ base: 'column', md: 'row' }} align='flex-start'>
                  TODO: Change to Author image
                  <MemberAvatar member={raidCleric} />
              </Flex> */
          }
        </Flex>
        <Flex direction="row" justifyContent="space-between" w="100%">
          <Stack w="90%">
            <Flex
              direction="column"
              width="100%"
              alignItems="flex-start"
              justifyContent="space-between"
              maxWidth="80%"
              paddingY={4}
            >
              {_.get(rip, "createdAt") && (
                <HStack>
                  <Text color="gray.100" fontSize="smaller">
                    {ripDateLabel}
                  </Text>
                  <Text color="gray.100" fontSize="smaller">
                    {displayDate(raidDate)}
                  </Text>
                </HStack>
              )}
              <Text color="white">
                {_.gt(_.size(description), 300)
                  ? `${description?.slice(0, 300)}...`
                  : description}
              </Text>
            </Flex>
          </Stack>
        </Flex>

        {latestUpdate && (
          <Flex direction="column" paddingY={4} w="100%">
            <HStack spacing={10} align="center">
              <Heading size="sm" color="white">
                Last Comment
              </Heading>
              <Text>{displayDate(latestUpdate.createdAt)}</Text>
            </HStack>

            <Flex alignItems={"baseline"} justify={"space-between"}>
              <Collapse startingHeight={24} in={isOpen}>
                <Text color="white">{latestUpdate.update}</Text>
              </Collapse>
              <Icon
                as={FaChevronDown}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                cursor="pointer"
                ml={1}
                zIndex={2}
                transform={isOpen ? "rotate(180deg)" : ""}
                transition={"all .25s ease-in-out"}
              />
            </Flex>
          </Flex>
        )}
      </Card>
    </LinkBox>
  );
};

export default RipCard;
