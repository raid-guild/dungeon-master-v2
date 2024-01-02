import {
  Box,
  Tab,
  // TabIndicator,  //We will need to export this chakra component from @raidguild/design-system through a design system upgrade
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@raidguild/design-system';
import { IRaid } from '@raidguild/dm-types';
import React from 'react';

import ProjectDetailsUpdateForm from './RaidUpdateForm/01-Project-Details';
import KeyLinksUpdateForm from './RaidUpdateForm/02-Key-Links';
import ClientPoCUpdateForm from './RaidUpdateForm/03-Client-PoC';
import AdditionalInfoUpdateForm from './RaidUpdateForm/04-Additional-Info';
import PortfolioUpdateForm from './RaidUpdateForm/05-Portfolio';

const raidTabs = ['Details', 'Links', 'Contacts', 'Portfolio', 'More'];

interface RaidUpdateFormProps {
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}

const RaidUpdateForm: React.FC<RaidUpdateFormProps> = ({
  closeModal,
  raid,
}: RaidUpdateFormProps) => (
  <Box as='section'>
    <Tabs variant='default'>
      <TabList w='100%'>
        {raidTabs.map((tab) => (
          <Tab key={tab} fontWeight={500}>
            {tab}
          </Tab>
        ))}
      </TabList>

      <Box
        bg='gray.800'
        maxW={{ base: 'xl', md: '3xl' }}
        marginX='auto'
        paddingY={4}
        rounded='lg'
      >
        <Box maxW='md' marginX='auto'>
          <Box marginY='6'>
            <TabPanels>
              <TabPanel>
                <ProjectDetailsUpdateForm raid={raid} closeModal={closeModal} />
              </TabPanel>
              <TabPanel>
                <KeyLinksUpdateForm raid={raid} closeModal={closeModal} />
              </TabPanel>
              <TabPanel>
                <ClientPoCUpdateForm raid={raid} closeModal={closeModal} />
              </TabPanel>
              <TabPanel>
                <PortfolioUpdateForm raid={raid} closeModal={closeModal} />
              </TabPanel>
              <TabPanel>
                <AdditionalInfoUpdateForm raid={raid} closeModal={closeModal} />
              </TabPanel>
            </TabPanels>
          </Box>
        </Box>
      </Box>
    </Tabs>
  </Box>
);

export default RaidUpdateForm;
