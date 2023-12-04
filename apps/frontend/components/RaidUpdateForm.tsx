import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@raidguild/design-system";

import { IRaid } from "@raidguild/dm-types";
import React from "react";

import ProjectDetailsUpdateForm from "./RaidUpdateForm/01-Project-Details";
import KeyLinksUpdateForm from "./RaidUpdateForm/02-Key-Links";
import ClientPoCUpdateForm from "./RaidUpdateForm/03-Client-PoC";
import AdditionalInfoUpdateForm from "./RaidUpdateForm/04-Additional-Info";
import PortfolioUpdateForm from "./RaidUpdateForm/05-Portfolio";

const raidTabs = [
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
}: RaidUpdateFormProps) => (
    <Box as="section">
      <Tabs variant="enclosed-colored" colorScheme="primary.500">
        <TabList>
          {raidTabs.map((tab) => <Tab key={tab}>{tab}</Tab>)}
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
                  <ProjectDetailsUpdateForm raid={raid} closeModal={closeModal}/>
                </TabPanel>
                <TabPanel>
                  <KeyLinksUpdateForm raid={raid} closeModal={closeModal}/>
                </TabPanel>
                <TabPanel>
                  <ClientPoCUpdateForm raid={raid} closeModal={closeModal}/>
                </TabPanel>
                <TabPanel>
                  <AdditionalInfoUpdateForm raid={raid} closeModal={closeModal}/>
                </TabPanel>
                <TabPanel>
                  <PortfolioUpdateForm raid={raid} closeModal={closeModal}/>
                </TabPanel>
              </TabPanels>
            </Box>
          </Box>
        </Box>
      </Tabs>
    </Box>
  );

export default RaidUpdateForm;
