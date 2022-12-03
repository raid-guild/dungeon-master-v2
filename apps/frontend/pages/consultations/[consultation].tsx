import _ from 'lodash';
import { HStack, Heading, Button } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import useConsultationDetail from '../../hooks/useConsultationDetail';
import SiteLayout from '../../components/SiteLayout';
import RaidDetailsCard from '../../components/RaidDetailsCard';

const Consultation = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: consultation } = useConsultationDetail({ token });
  console.log(consultation);

  return (
    <>
      <NextSeo title="Consultation" />

      <SiteLayout
        subheader={<Heading>{_.get(consultation, 'projectName')}</Heading>}
        isLoading={false}
      >
        <HStack align="flex-start">
          <RaidDetailsCard consultation={consultation} />
          <Button>Create Raid</Button>
        </HStack>
      </SiteLayout>
    </>
  );
};

export default Consultation;