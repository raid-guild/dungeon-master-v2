import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useConsultationDetail from '../../hooks/useConsultationDetail';

const Consultation = () => {
  const { data: consultation } = useConsultationDetail();
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
