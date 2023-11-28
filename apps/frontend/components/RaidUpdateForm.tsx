import {
  Box,
  Button,
  DatePicker,
  Flex,
  FormControl,
  FormLabel,
  forwardRef,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@raidguild/design-system";
import { useRaidUpdate } from "@raidguild/dm-hooks";
import {
  BUDGET_DISPLAY_OPTIONS,
  DELIVERY_PRIORITIES_DISPLAY_OPTIONS,
  IRaid,
  RAID_CATEGORY_OPTIONS,
} from "@raidguild/dm-utils";
import { add } from "date-fns";
import _ from "lodash";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ProjectDetailsUpdateForm from "./RaidUpdateForm/01-Project-Details";
import KeyLinksUpdateForm from "./RaidUpdateForm/02-Key-Links";

const raid_tabs = [
  "Project Details",
  "Key Links",
  "Client PoC",
  "Additional Info",
  "Portfolio",
];

interface RaidUpdateFormProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}
const RaidUpdateForm: React.FC<RaidUpdateFormProps> = ({
  raidId,
  closeModal,
  raid,
}: RaidUpdateFormProps) => {
  
  return (
    <Box as="section">
      <Tabs variant={"enclosed-colored"} colorScheme="primary.500">
        <TabList>
          {raid_tabs.map((tab) => <Tab key={tab}>{tab}</Tab>)}
        </TabList>

        <Box
          bg="gray.800"
          maxW={{ base: "xl", md: "3xl" }}
          marginX="auto"
          paddingX={{ base: "6", md: "8" }}
          paddingY="6"
          rounded="lg"
        >
          <Box maxW="md" marginX="auto">
            <Box marginY="6">
              
                <TabPanels>
                  <TabPanel>
                  <ProjectDetailsUpdateForm raid={raid}/>
                  </TabPanel>
                  <TabPanel>
                  <KeyLinksUpdateForm raid={raid}/>
                  </TabPanel>

                  <TabPanel>
                    <Text>Client PoC</Text>
                  </TabPanel>

                  <TabPanel>
                    <Text>Additional Info</Text>
                  </TabPanel>

                  <TabPanel>
                    <Text>Portfolio</Text>
                  </TabPanel>
                </TabPanels>
              
            </Box>
          </Box>
        </Box>
      </Tabs>
    </Box>
  );
};

export default RaidUpdateForm;
