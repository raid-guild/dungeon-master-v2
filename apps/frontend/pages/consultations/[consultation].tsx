import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import useConsultationDetail from '../../hooks/useConsultationDetail';
import SiteLayout from '../../components/SiteLayout';

const Consultation = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: consultation } = useConsultationDetail({ token });
  console.log(consultation);

  return (
    <>
      <NextSeo title="Consultation" />

      <SiteLayout
        subheader={<Heading>Consultation Detail</Heading>}
        isLoading={false}
      >
        <Stack spacing={8} align="center">
          <Heading size="md">{_.get(consultation, 'project_name')}</Heading>
        </Stack>
      </SiteLayout>
    </>
  );
};

export default Consultation;
