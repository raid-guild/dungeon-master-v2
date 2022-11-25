import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useConsultationDetail from '../../hooks/useConsultationDetail';
import { useSession } from 'next-auth/react';

const Consultation = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: consultation } = useConsultationDetail({ token });
  console.log(consultation);

  return (
    <>
      <NextSeo title="Consultation" />

      <Stack spacing={8} align="center">
        <Heading>Consultation Detail</Heading>
        <Heading size="md">{_.get(consultation, 'project_name')}</Heading>
      </Stack>
    </>
  );
};

export default Consultation;
